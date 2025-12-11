# # C:\Users\HP\Desktop\arachnie\Arachnie\backend\app\utils\pdf_processor.py
# import io
# import os
# import tempfile
# from typing import Tuple, Optional
# from PyPDF2 import PdfReader, PdfWriter
# import pikepdf
# from PIL import Image

# class PDFProcessor:
#     """Handle PDF compression with encryption support"""
    
#     @staticmethod
#     async def compress_pdf(
#         input_bytes: bytes,
#         quality: int = 2,
#         password: Optional[str] = None
#     ) -> Tuple[bytes, dict]:
#         """
#         Compress PDF with optional password handling
        
#         Args:
#             input_bytes: Original PDF bytes
#             quality: Compression level (0-4)
#             password: Password for encrypted PDFs
            
#         Returns:
#             Tuple of (compressed_bytes, metadata)
#         """
#         original_size = len(input_bytes)
        
#         try:
#             # Handle encrypted PDFs with pikepdf
#             with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp_input:
#                 tmp_input.write(input_bytes)
#                 tmp_input.flush()
#                 input_path = tmp_input.name
            
#             output_path = input_path.replace('.pdf', '_compressed.pdf')
            
#             # Open with pikepdf (handles encryption)
#             with pikepdf.open(input_path, password=password or '') as pdf:
#                 # Compression settings based on quality level
#                 compression_settings = {
#                     0: pikepdf.Compression.deflate,  # Best quality
#                     1: pikepdf.Compression.deflate,
#                     2: pikepdf.Compression.deflate,
#                     3: pikepdf.Compression.deflate,
#                     4: pikepdf.Compression.deflate,  # Smallest size
#                 }
                
#                 # Remove unnecessary elements
#                 for page in pdf.pages:
#                     # Compress images in the page
#                     for image in page.images.keys():
#                         try:
#                             raw_image = page.images[image]
#                             pil_image = raw_image.as_pil_image()
                            
#                             # Reduce image quality based on compression level
#                             quality_map = {0: 95, 1: 85, 2: 75, 3: 65, 4: 50}
#                             img_quality = quality_map.get(quality, 75)
                            
#                             # Save compressed image
#                             img_buffer = io.BytesIO()
#                             if pil_image.mode == 'RGBA':
#                                 pil_image = pil_image.convert('RGB')
#                             pil_image.save(img_buffer, format='JPEG', 
#                                          quality=img_quality, optimize=True)
                            
#                         except Exception as e:
#                             print(f"Image compression warning: {e}")
#                             continue
                
#                 # Save with compression
#                 pdf.save(
#                     output_path,
#                     compress_streams=True,
#                     stream_decode_level=pikepdf.StreamDecodeLevel.generalized,
#                     object_stream_mode=pikepdf.ObjectStreamMode.generate
#                 )
            
#             # Read compressed file
#             with open(output_path, 'rb') as f:
#                 compressed_bytes = f.read()
            
#             # Cleanup
#             os.unlink(input_path)
#             os.unlink(output_path)
            
#             compressed_size = len(compressed_bytes)
#             reduction = ((original_size - compressed_size) / original_size) * 100
            
#             metadata = {
#                 'original_size': original_size,
#                 'compressed_size': compressed_size,
#                 'reduction_percentage': round(reduction, 2),
#                 'was_encrypted': password is not None
#             }
            
#             return compressed_bytes, metadata
            
#         except pikepdf.PasswordError:
#             raise ValueError("Invalid password for encrypted PDF")
#         except Exception as e:
#             raise Exception(f"Compression failed: {str(e)}")
    
#     @staticmethod
#     def get_pdf_info(input_bytes: bytes, password: Optional[str] = None) -> dict:
#         """Get PDF metadata"""
#         try:
#             with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp:
#                 tmp.write(input_bytes)
#                 tmp.flush()
                
#                 with pikepdf.open(tmp.name, password=password or '') as pdf:
#                     info = {
#                         'pages': len(pdf.pages),
#                         'is_encrypted': pdf.is_encrypted,
#                         'version': str(pdf.pdf_version),
#                     }
                
#                 os.unlink(tmp.name)
#                 return info
                
#         except Exception as e:
#             return {'error': str(e)}
