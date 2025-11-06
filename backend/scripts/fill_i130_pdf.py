from PyPDF2 import PdfReader, PdfWriter
import os

base_dir = os.path.dirname(os.path.abspath(__file__))
pdf_path = os.path.join(base_dir, "../data/i130.pdf")
output_path = os.path.join(base_dir, "../generated/filled_i130.pdf")

def fill_pdf(form_data: dict):
    reader = PdfReader(pdf_path)
    writer = PdfWriter()

    # Copy all pages
    for page in reader.pages:
        writer.add_page(page)

    # Get form fields
    if reader.get_fields() is None:
        print("No form fields found in PDF.")
        return None

    fields = reader.get_fields()
    field_values = {}

    for field_name, value in form_data.items():
        field = fields.get(field_name)
        if field is None:
            continue  # Skip if field doesn't exist

        field_type = field.get("/FT")

        if field_type == "/Btn":  # Checkbox or Radio
            if field.get("/Kids"):  # Radio button group
                field_values[field_name] = value  # Set export value directly
            else:  # Checkbox
                field_values[field_name] = "Yes" if bool(value) else "Off"
        elif field_type == "/Tx":  # Text field
            field_values[field_name] = str(value) if value is not None else ""
        elif field_type == "/Ch":  # Choice (dropdown)
            field_values[field_name] = str(value) if value is not None else ""
        else:
            field_values[field_name] = str(value) if value is not None else ""

    # Apply field values to ALL pages (important!)
    for page_num in range(len(writer.pages)):
        writer.update_page_form_field_values(writer.pages[page_num], field_values)

    # Ensure output directory exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    # Write output
    with open(output_path, "wb") as f:
        writer.write(f)

    return output_path


# === Example Usage ===
if __name__ == "__main__":
    sample_data = {
        "form1[0].#subform[0].PetitionerFamilyName[0]": "DOE",
        "form1[0].#subform[0].PetitionerGivenName[0]": "JOHN",
        "form1[0].#subform[0].CheckBox_Married[0]": True,  # Checkbox
        # Add more fields as needed
    }

    result = fill_pdf(sample_data)
    print(f"PDF filled: {result}")