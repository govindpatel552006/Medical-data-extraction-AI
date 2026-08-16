import pytesseract
from PIL import Image
import platform
import shutil

if platform.system() == 'Windows':
    pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
else:
    tesseract_path = shutil.which('tesseract') or '/usr/bin/tesseract'
    pytesseract.pytesseract.tesseract_cmd = tesseract_path

MAX_DIMENSION = 1600


def extract_text_from_image_file(file_obj):
    """
    Reads directly from the uploaded file stream (works with any storage
    backend, including Cloudinary). Always resets the file pointer back
    to 0 before returning — success or failure — so the file can still
    be saved to storage afterward.
    """
    try:
        file_obj.seek(0)
        image = Image.open(file_obj)

        if max(image.size) > MAX_DIMENSION:
            image.thumbnail((MAX_DIMENSION, MAX_DIMENSION), Image.LANCZOS)

        text = pytesseract.image_to_string(image)
        return text.strip()
    except Exception as e:
        return f"OCR_ERROR: {str(e)}"
    finally:
        file_obj.seek(0)