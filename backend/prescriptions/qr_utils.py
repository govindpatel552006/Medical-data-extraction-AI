import qrcode
from io import BytesIO
from django.core.files.base import ContentFile


def generate_qr_code(data_url):
    """
    Takes a URL string, returns a Django ContentFile of the QR PNG image.
    """
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=10,
        border=4,
    )
    qr.add_data(data_url)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")

    buffer = BytesIO()
    img.save(buffer, format='PNG')
    buffer.seek(0)

    return ContentFile(buffer.read(), name='qr.png')