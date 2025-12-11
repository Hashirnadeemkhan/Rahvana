from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import StreamingResponse
from typing import Optional
import io

from app.utils.validator import validate_pdf
from app.utils.pdf_processor import PDFProcessor
from app.config import settings

router = APIRouter(prefix="/api/compress", tags=["compression"])

@router.post("/")
async def compress_pdf(
    file: UploadFile = File(...),
    quality: int = Form(2),
    password: Optional[str] = Form(None)
):
    """
    Compress PDF file
    
    Parameters:
    - file: PDF file to compress
    - quality: Compression level (0-4, where 0 is best quality)
    - password: Password for encrypted PDFs (optional)
    """
    
    # Validate file
    await validate_pdf(file)
    
    # Read file content
    content = await file.read()
    
    # Check file size
    if len(content) > settings.MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum size is {settings.MAX_FILE_SIZE / 1024 / 1024}MB"
        )
    
    try:
        # Compress PDF
        processor = PDFProcessor()
        compressed_bytes, metadata = await processor.compress_pdf(
            content, 
            quality=quality,
            password=password
        )
        
        # Return compressed file
        return StreamingResponse(
            io.BytesIO(compressed_bytes),
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename=compressed_{file.filename}",
                "X-Original-Size": str(metadata['original_size']),
                "X-Compressed-Size": str(metadata['compressed_size']),
                "X-Reduction": str(metadata['reduction_percentage'])
            }
        )
        
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Compression failed: {str(e)}")

@router.post("/info")
async def get_pdf_info(
    file: UploadFile = File(...),
    password: Optional[str] = Form(None)
):
    """Get PDF information"""
    
    await validate_pdf(file)
    content = await file.read()
    
    processor = PDFProcessor()
    info = processor.get_pdf_info(content, password)
    
    return {"filename": file.filename, "info": info}
