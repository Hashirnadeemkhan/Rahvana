import io
import textwrap
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Flowable
from app.core.form_configs import ds260_config

class BookmarkFlowable(Flowable):
    def __init__(self, title, key):
        Flowable.__init__(self)
        self.title = title
        self.key = key
    
    def draw(self):
        # Add bookmark and outline entry
        self.canv.bookmarkPage(self.key)
        self.canv.addOutlineEntry(self.title, self.key, level=0, closed=True)

class DS260GeneratorService:
    def __init__(self):
        self.question_mapping = ds260_config.FIELD_MAPPING

    def generate_pdf(self, form_data: dict) -> io.BytesIO:
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter)
        styles = getSampleStyleSheet()
        
        # Custom styles
        title_style = styles['Title']
        heading_style = styles['Heading2']
        question_style = ParagraphStyle(
            'Question',
            parent=styles['BodyText'],
            fontName='Helvetica-Bold',
            fontSize=10,
            spaceAfter=2,
            textColor=colors.black
        )
        answer_style = ParagraphStyle(
            'Answer',
            parent=styles['BodyText'],
            fontName='Helvetica',
            fontSize=10,
            spaceAfter=10,
            textColor=colors.darkblue
        )

        flowables = []
        
        # Title
        flowables.append(Paragraph("DS-260: Immigrant Visa Electronic Application", title_style))
        # flowables.append(Paragraph("Application responses", styles['Normal']))
        flowables.append(Spacer(1, 20))
        
        # Group data keys to keep order if possible, or just iterate mappings
        # Since form_data might be unordered or partial, we iterate through our known config order
        # But we don't have section info in config. 
        # For now, we will iterate through the mapping keys and check if data exists.
        
        # Optimization: We want to maintain the original order of questions. 
        # Since python 3.7+ dicts preserve insertion order, and our config was generated from the file, 
        # iterating config keys should give correct order.
        
        # Track current section to insert headers
        current_section = None
        
        for key, original_label in self.question_mapping.items():
            # Check if section changed
            if hasattr(ds260_config, 'SECTION_MAPPING'):
                section = ds260_config.SECTION_MAPPING.get(key)
                if section and section != current_section:
                    current_section = section
                    
                    # Create a unique key for the bookmark
                    bookmark_key = f"section_{hash(section)}"
                    flowables.append(BookmarkFlowable(section, bookmark_key))
                    
                    flowables.append(Spacer(1, 10))
                    flowables.append(Paragraph(section, heading_style))
                    flowables.append(Spacer(1, 5))
            
            # Get the answer value
            val = form_data.get(key)
            
            # Use original label
            q_text = original_label
            
            # Show answer or N/A if not provided
            if val:
                a_text = str(val)
                # If "Off", show "No"
                if a_text == "Off":
                    a_text = "No"
            else:
                a_text = "N/A"
            
            flowables.append(Paragraph(q_text, question_style))
            flowables.append(Paragraph(a_text, answer_style))
            
        try:
            doc.build(flowables)
        except Exception as e:
            # Fallback if build fails (e.g. empty flowables)
            c = canvas.Canvas(buffer, pagesize=letter)
            c.drawString(100, 750, "Error generating PDF: " + str(e))
            c.save()

        buffer.seek(0)
        return buffer
