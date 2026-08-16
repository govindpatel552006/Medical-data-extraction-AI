FROM python:3.11-slim

RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Verify tesseract installed correctly and print its path (visible in build logs)
RUN which tesseract && tesseract --version

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN mkdir -p media/prescriptions media/qrcodes

RUN python manage.py collectstatic --noinput

EXPOSE 10000

CMD python manage.py migrate && gunicorn core.wsgi:application --bind 0.0.0.0:10000 --timeout 120