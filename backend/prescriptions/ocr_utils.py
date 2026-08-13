import pytesseract
from PIL import Image
import platform

# On Windows, point pytesseract to the installed Tesseract executable
if platform.system() == 'Windows':
    pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'


def extract_text_from_image(file_path):
    """
    Takes a file path to an image, returns extracted text.
    """
    try:
        image = Image.open(file_path)
        text = pytesseract.image_to_string(image)
        return text.strip()
    except Exception as e:
        return f"OCR_ERROR: {str(e)}"