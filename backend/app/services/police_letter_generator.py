import io
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT

class PoliceLetterGeneratorService:
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self.setup_custom_styles()

    def setup_custom_styles(self):
        # Base style for the whole document (Times-Roman)
        self.base_style = ParagraphStyle(
            'Base',
            fontName='Times-Roman',
            fontSize=12,
            leading=18,
            textColor=colors.black
        )
        
        # Title style
        self.title_style = ParagraphStyle(
            'Title',
            parent=self.base_style,
            fontName='Times-Bold',
            fontSize=14,
            alignment=TA_CENTER,
            spaceAfter=30
        )
        
        # Recipient style
        self.recipient_style = ParagraphStyle(
            'Recipient',
            parent=self.base_style,
            fontName='Times-Roman',
            spaceAfter=12
        )

        # Bold recipient parts
        self.recipient_bold_style = ParagraphStyle(
            'RecipientBold',
            parent=self.recipient_style,
            fontName='Times-Bold'
        )

        # Subject style
        self.subject_style = ParagraphStyle(
            'Subject',
            parent=self.base_style,
            fontName='Times-Bold',
            spaceBefore=10,
            spaceAfter=20
        )
        
        # Body style
        self.body_style = ParagraphStyle(
            'Body',
            parent=self.base_style,
            alignment=TA_JUSTIFY,
            spaceAfter=15
        )
        
        # Contact details style
        self.contact_style = ParagraphStyle(
            'Contact',
            parent=self.base_style,
            spaceAfter=5
        )

        # Signature style
        self.signature_style = ParagraphStyle(
            'Signature',
            parent=self.base_style,
            spaceBefore=40
        )

    def generate_pdf(self, form_data: dict, province: str) -> io.BytesIO:
        buffer = io.BytesIO()
        # Create a SimpleDocTemplate with A4 size and margins
        doc = SimpleDocTemplate(
            buffer, 
            pagesize=A4, 
            rightMargin=56, # 20mm approx
            leftMargin=56, 
            topMargin=56, 
            bottomMargin=56
        )
        
        flowables = []
        
        # 1. Title
        flowables.append(Paragraph("Application for Issuance of Police Character Certificate", self.title_style))
        
        # 2. Recipient
        flowables.append(Paragraph("To,", self.recipient_bold_style))
        flowables.append(Paragraph("The Senior Superintendent of Police (SSP)", self.recipient_bold_style))
        district = form_data.get('district', '[District/Region]')
        flowables.append(Paragraph(f"{district}, {province}, Pakistan", self.recipient_style))
        flowables.append(Spacer(1, 10))
        
        # 3. Subject
        flowables.append(Paragraph(f"Subject: Application for Issuance of Police Character Certificate", self.subject_style))
        
        # 4. Salutation
        flowables.append(Paragraph("Respected Sir,", self.base_style))
        flowables.append(Spacer(1, 10))
        
        # 5. Body Paragraph 1
        full_name = form_data.get('fullName', '[Full Name]')
        relation = form_data.get('relation', 'S/O')
        guardian = form_data.get('guardianName', '[Guardian Name]')
        cnic = form_data.get('cnic', '[CNIC Number]')
        address = form_data.get('address', '[Full Residential Address]')
        
        body1_text = (
            f"I, <b>{full_name}</b>, <b>{relation}</b> <b>{guardian}</b>, "
            f"CNIC No. <b>{cnic}</b>, resident of <b>{address}</b>, "
            f"respectfully request the issuance of a Police Character Certificate in my favor."
        )
        flowables.append(Paragraph(body1_text, self.body_style))
        
        # 6. Body Paragraph 2
        purpose = form_data.get('purpose', '[Purpose]')
        body2_text = (
            f"The certificate is required for <b>{purpose}</b> purposes. "
            f"I affirm that I have no criminal record, and the certificate is necessary for my overseas plans."
        )
        flowables.append(Paragraph(body2_text, self.body_style))
        
        # 7. Transition
        flowables.append(Paragraph("Kindly process my request at your earliest convenience. For any further information, you may contact me at:", self.base_style))
        flowables.append(Spacer(1, 10))
        
        # 8. Contact Info
        email = form_data.get('email', '[Email Address]')
        phone = form_data.get('phone', '[Phone Number]')
        flowables.append(Paragraph(f"<b>Email:</b> {email}", self.contact_style))
        flowables.append(Paragraph(f"<b>Phone:</b> {phone}", self.contact_style))
        
        flowables.append(Spacer(1, 20))
        flowables.append(Paragraph("I shall remain grateful for your cooperation.", self.base_style))
        
        # 9. Signature Block
        flowables.append(Paragraph("<b>Sincerely,</b>", self.signature_style))
        flowables.append(Paragraph(full_name, self.base_style))
        flowables.append(Paragraph(f"CNIC: {cnic}", self.base_style))
        date_str = datetime.now().strftime("%d/%m/%Y")
        flowables.append(Paragraph(f"Date: {date_str}", self.base_style))
        
        # Build the PDF
        doc.build(flowables)
        
        buffer.seek(0)
        return buffer
