FROM python:3.11-slim

# Install system dependencies including Tesseract OCR
RUN mkdir -p media/prescriptions media/qrcodes
WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN mkdir -p media/prescriptions media/qrcodes staticfiles

RUN python manage.py collectstatic --noinput

EXPOSE 10000

CMD python manage.py migrate && gunicorn core.wsgi:application --bind 0.0.0.0:10000 --timeout 120