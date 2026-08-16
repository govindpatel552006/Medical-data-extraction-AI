import pytesseract
from PIL import Image
import platform
import shutil

if platform.system() == 'Windows':
    pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
elif shutil.which('tesseract'):
    pytesseract.pytesseract.tesseract_cmd = shutil.which('tesseract')

MAX_DIMENSION = 1600  # cap image size to keep OCR fast and light on memory


def extract_text_from_image(file_path):
    """
    Takes a file path to an image, returns extracted text.
    Downscales large images first to avoid timeouts/OOM on
    memory-constrained hosting (e.g. Render free tier).
    """
    try:
        image = Image.open(file_path)

        # Downscale if the image is larger than MAX_DIMENSION on either side
        if max(image.size) > MAX_DIMENSION:
            image.thumbnail((MAX_DIMENSION, MAX_DIMENSION), Image.LANCZOS)

        text = pytesseract.image_to_string(image)
        return text.strip()
    except Exception as e:
        return f"OCR_ERROR: {str(e)}"