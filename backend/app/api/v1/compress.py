import logging
import os
import io
import tempfile
from typing import Optional
from concurrent.futures import ThreadPoolExecutor
import asyncio

import pikepdf
from PIL import Image
import fitz  # PyMuPDF
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import Response

# Configure Logging
logger = logging.getLogger(__name__)

router = APIRouter()

class PDFProcessor:
    """Handle EXTREME PDF compression with logging and speed optimization"""
    
    @staticmethod
    def process_image(img_data: tuple, doc, max_dimension: int = 1024, img_quality: int = 20):
        """Process a single image (for parallel processing)"""
        img_index, img, page_num = img_data
        xref = img[0]
        
        try:
            s = doc.extract_image(xref)
            
            # Skip small/already compressed JPEGs
            if s['ext'].lower() in ('jpeg', 'jpg') and s['size'] < 50 * 1024:
                return None
            
            image_bytes = s["image"]
            pil_image = Image.open(io.BytesIO(image_bytes))
            width, height = pil_image.size

            # Check and resize only if needed
            should_resize = width > max_dimension or height > max_dimension
            
            if should_resize:
                ratio = min(max_dimension/width, max_dimension/height)
                new_width = int(width * ratio)
                new_height = int(height * ratio)
                
                # Use LANCZOS for better quality at similar speed
                pil_image = pil_image.resize(
                    (new_width, new_height),
                    Image.Resampling.LANCZOS
                )
                
            if pil_image.mode != 'RGB':
                pil_image = pil_image.convert('RGB')
            
            # Aggressive JPEG compression
            img_buffer = io.BytesIO()
            pil_image.save(
                img_buffer,
                format='JPEG',
                quality=img_quality, 
                optimize=True
            )
            compressed_image_bytes = img_buffer.getvalue()
            
            return (xref, compressed_image_bytes)
            
        except Exception as e:
            logger.warning(f"Failed to process image {img_index} on page {page_num + 1}: {e}")
            return None
    
    @staticmethod
    async def compress_pdf(
        input_bytes: bytes,
        password: Optional[str] = None
    ) -> tuple[bytes, dict]:
        
        original_size = len(input_bytes)
        temp_files = []
        
        try:
            # Setup temporary files
            with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp_input:
                tmp_input.write(input_bytes)
                tmp_input.flush()
                input_path = tmp_input.name
                temp_files.append(input_path)
            
            intermediate_path = input_path.replace('.pdf', '_intermediate.pdf')
            output_path = input_path.replace('.pdf', '_compressed.pdf')
            temp_files.append(intermediate_path)
            temp_files.append(output_path)
            
            logger.info(f"Starting compression. Original size: {original_size} bytes.")
            
            # Hardcoded settings
            target_dpi = 72
            img_quality = 80
            max_dimension = 1024
            
            # --- STEP 1: Parallel Image Processing ---
            doc = fitz.open(input_path)
            
            # Collect all images with their page numbers
            all_images = []
            for page_num in range(len(doc)):
                page = doc[page_num]
                image_list = page.get_images(full=True)
                for img_index, img in enumerate(image_list):
                    all_images.append((img_index, img, page_num))
            
            if all_images:
                logger.info(f"Processing {len(all_images)} images across {len(doc)} pages...")
                
                # Process images in parallel using ThreadPoolExecutor
                loop = asyncio.get_event_loop()
                with ThreadPoolExecutor(max_workers=4) as executor:
                    tasks = [
                        loop.run_in_executor(
                            executor,
                            PDFProcessor.process_image,
                            img_data,
                            doc,
                            max_dimension,
                            img_quality
                        )
                        for img_data in all_images
                    ]
                    results = await asyncio.gather(*tasks)
                
                # Apply compressed images back to pages
                for page_num in range(len(doc)):
                    page = doc[page_num]
                    for result in results:
                        if result:
                            xref, compressed_bytes = result
                            try:
                                page.replace_image(xref, stream=compressed_bytes)
                            except:
                                pass  # Image might not be on this page
            
            logger.info("Image optimization complete. Starting structural saving.")
            
            # Save with aggressive settings
            doc.save(
                intermediate_path,
                garbage=4,
                deflate=True,
                clean=True,
                pretty=False  # Faster saving
            )
            doc.close()
            
            # --- STEP 2: Quick Structure Cleanup ---
            def pikepdf_process():
                with pikepdf.open(intermediate_path, password=password or '') as pdf:
                    try:
                        with pdf.open_metadata() as meta:
                            meta.clear()
                    except Exception:
                        pass
                    
                    pdf.save(
                        output_path,
                        compress_streams=True,
                        stream_decode_level=pikepdf.StreamDecodeLevel.generalized,
                        object_stream_mode=pikepdf.ObjectStreamMode.generate,
                        linearize=True  # Enable linearization for faster web viewing
                    )
            
            # Run pikepdf in thread pool
            loop = asyncio.get_event_loop()
            await loop.run_in_executor(None, pikepdf_process)
            
            # Read final file
            with open(output_path, 'rb') as f:
                compressed_bytes = f.read()
            
            compressed_size = len(compressed_bytes)
            reduction = ((original_size - compressed_size) / original_size) * 100
            
            metadata = {
                'original_size': original_size,
                'compressed_size': compressed_size,
                'reduction_percentage': round(reduction, 2),
                'was_encrypted': password is not None
            }
            
            logger.info(f"Compression complete. Reduced by {metadata['reduction_percentage']}%.")
            return compressed_bytes, metadata
            
        except pikepdf.PasswordError:
            logger.error("Invalid password provided.")
            raise ValueError("Invalid password for encrypted PDF")
        except Exception as e:
            logger.critical(f"Critical compression failure: {str(e)}", exc_info=True)
            raise Exception(f"Compression failed: {str(e)}")
            
        finally:
            # Robust Cleanup
            for path in temp_files:
                if os.path.exists(path):
                    try:
                        os.unlink(path)
                    except OSError:
                        pass


@router.post("/compress")
async def compress_pdf(
    file: UploadFile = File(...),
    password: Optional[str] = Form(None)
):
    """Compress PDF file with MAXIMUM AGGRESSION and SPEED"""
    
    logger.info(f"Request received for file: {file.filename}")

    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    content = await file.read()
    
    if len(content) > 100 * 1024 * 1024:
        logger.error(f"File size {len(content)} exceeds 100MB limit.")
        raise HTTPException(status_code=413, detail="File too large. Maximum size is 100MB")
    
    try:
        compressed_bytes, metadata = await PDFProcessor.compress_pdf(
            content, 
            password=password
        )
        
        headers = {
            "Content-Disposition": f'attachment; filename="compressed_{file.filename}"',
            "X-Original-Size": str(metadata['original_size']),
            "X-Compressed-Size": str(metadata['compressed_size']),
            "X-Reduction": str(metadata['reduction_percentage']),
            "Access-Control-Expose-Headers": "X-Original-Size, X-Compressed-Size, X-Reduction",
            "Cache-Control": "no-cache"  # Prevent caching issues
        }
        
        return Response(
            content=compressed_bytes,
            media_type="application/pdf",
            headers=headers
        )
        
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))
    except Exception as e:
        logger.error(f"Final response error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Compression failed: {str(e)}")