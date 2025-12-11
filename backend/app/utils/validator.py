# # backend/app/utils/validator.py
# import magic
# from fastapi import UploadFile, HTTPException
# from app.config import settings

# async def validate_pdf(file: UploadFile) -> bool:
#     """Validate if uploaded file is a valid PDF"""
    
#     # Check file extension
#     if not file.filename.lower().endswith('.pdf'):
#         raise HTTPException(
#             status_code=400,
#             detail="Only PDF files are allowed"
#         )
    
#     # Read first chunk to check file type
#     content = await file.read(2048)
#     await file.seek(0)  # Reset file pointer
    
#     # Check magic bytes
#     mime = magic.from_buffer(content, mime=True)
#     if mime != 'application/pdf':
#         raise HTTPException(
#             status_code=400,
#             detail="Invalid PDF file"
#         )
    
#     return True