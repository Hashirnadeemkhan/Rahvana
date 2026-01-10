import io
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT, TA_RIGHT

class AuthorityLetterGeneratorService:
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self.setup_custom_styles()

    def setup_custom_styles(self):
        self.base_style = ParagraphStyle(
            'Base',
            fontName='Times-Roman',
            fontSize=12,
            leading=18,
            textColor=colors.black
        )
        
        self.title_style = ParagraphStyle(
            'Title',
            parent=self.base_style,
            fontName='Times-Bold',
            fontSize=18,
            alignment=TA_CENTER,
            spaceAfter=30,
            textDecoration='underline'
        )

        self.specimen_style = ParagraphStyle(
            'Specimen',
            parent=self.base_style,
            fontName='Times-Roman',
            fontSize=10,
            alignment=TA_RIGHT,
            spaceAfter=10,
            textDecoration='underline'
        )
        
        self.body_style = ParagraphStyle(
            'Body',
            parent=self.base_style,
            alignment=TA_LEFT,
            leading=24, # Increased leading for lines
            spaceAfter=15
        )

        self.signature_block_style = ParagraphStyle(
            'SignatureBlock',
            parent=self.base_style,
            alignment=TA_LEFT,
            leading=20,
            leftIndent=250 # Indent for signature block
        )

    def generate_pdf(self, form_data: dict) -> io.BytesIO:
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer, 
            pagesize=A4, 
            rightMargin=72, 
            leftMargin=72, 
            topMargin=72, 
            bottomMargin=72
        )
        
        flowables = []
        
        # Specimen Authority Letter (Top Right)
        flowables.append(Paragraph("<u>Specimen Authority Letter</u>", self.specimen_style))
        flowables.append(Spacer(1, 20))

        # Title
        flowables.append(Paragraph("<u>AUTHORITY LETTER</u>", self.title_style))
        flowables.append(Spacer(1, 20))
        
        # Main Body
        # I, Mr./Mrs. [Name]
        # S/O,D/O, W/O, [RelationName]
        # CNIC No. [CNIC]
        # Hereby authorized my real Father/Mother/Brother /Son/Cousin or relative
        # Mr./Mrs. [AuthName]
        # S/O,D/O, W/O, [AuthRelationName]
        # CNIC No. [AuthCNIC]
        # Resident of [AuthAddress]
        # to process and signed my behalf and collect my Police Clearance Certificate from SSP Office, [OfficeLocation].

        name = form_data.get('fullName', '________________________________________________')
        relation_type = form_data.get('relationType', 'S/O, D/O, W/O')
        relation_name = form_data.get('relationName', '________________________________________________')
        cnic = form_data.get('cnic', '________________________________________________')
        
        auth_name = form_data.get('authFullName', '________________________________________________')
        auth_relation_type = form_data.get('authRelationType', 'S/O, D/O, W/O')
        auth_relation_name = form_data.get('authRelationName', '________________________________________________')
        auth_cnic = form_data.get('authCnic', '________________________________________________')
        auth_address = form_data.get('authAddress', '________________________________________________')
        auth_relationship = form_data.get('authRelationship', 'Father/Mother/Brother/Son/Cousin or relative')
        
        office_location = form_data.get('officeLocation', 'Islamabad')

        body_text = f"""
        I, Mr./Mrs. <b>{name}</b><br/>
        {relation_type}, <b>{relation_name}</b><br/>
        CNIC No. <b>{cnic}</b><br/><br/>
        Hereby authorized my real {auth_relationship}<br/>
        Mr./Mrs. <b>{auth_name}</b><br/>
        {auth_relation_type}, <b>{auth_relation_name}</b><br/>
        CNIC No. <b>{auth_cnic}</b><br/>
        Resident of <b>{auth_address}</b><br/><br/>
        to process and signed my behalf and collect my Police Clearance Certificate from SSP<br/>
        Office, {office_location}.
        """
        
        flowables.append(Paragraph(body_text, self.body_style))
        flowables.append(Spacer(1, 40))

        # Signature Block
        # Signature __________________
        # Name: _____________________
        # Fathers Name ______________
        # Passport No. ______________
        # Address in Abroad _________
        
        passport = form_data.get('passportNo', '________________________________')
        abroad_address = form_data.get('abroadAddress', '________________________________')
        stay_from = form_data.get('stayFrom', '________________')
        stay_to = form_data.get('stayTo', '________________')

        sig_text = f"""
        Signature ___________________________<br/>
        Name: <b>{name}</b><br/>
        Fathers Name <b>{relation_name}</b><br/>
        Passport No. <b>{passport}</b><br/>
        Address in Abroad <b>{abroad_address}</b><br/>
        Stay Duration: <b>{stay_from} to {stay_to}</b>
        """
        
        flowables.append(Paragraph(sig_text, self.signature_block_style))

        doc.build(flowables)
        buffer.seek(0)
        return buffer
