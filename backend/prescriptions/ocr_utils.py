import pytesseract
from PIL import Image
import platform
import shutil

# On Windows, point pytesseract to the installed Tesseract executable.
# On Linux (Render), tesseract is installed via apt and is already on PATH,
# so we only override the path if we're on Windows.
if platform.system() == 'Windows':
    pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
elif shutil.which('tesseract'):
    pytesseract.pytesseract.tesseract_cmd = shutil.which('tesseract')


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