import pytesseract
from PIL import Image
import platform
import shutil

if platform.system() == 'Windows':
    pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
elif shutil.which('tesseract'):
    pytesseract.pytesseract.tesseract_cmd = shutil.which('tesseract')

MAX_DIMENSION = 1600


def extract_text_from_image_file(file_obj):
    """
    Takes a Django uploaded file object (in-memory or temp file) and
    returns extracted text. Works regardless of storage backend since
    it never touches .path — reads directly from the file stream.
    """
    try:
        file_obj.seek(0)
        image = Image.open(file_obj)

        if max(image.size) > MAX_DIMENSION:
            image.thumbnail((MAX_DIMENSION, MAX_DIMENSION), Image.LANCZOS)

        text = pytesseract.image_to_string(image)
        file_obj.seek(0)  # reset pointer so it can still be saved to storage afterward
        return text.strip()
    except Exception as e:
        return f"OCR_ERROR: {str(e)}"