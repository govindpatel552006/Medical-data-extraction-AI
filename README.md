# MedAI — Prescription Scanner & Diet Plan Generator

A full-stack SaaS application that scans a user's medical prescription or lab report, extracts the text using OCR, and generates a personalized 7-day diet plan based on detected medical conditions. Each prescription also gets a shareable QR code linking to a public, no-login record view.

**Live demo:** https://medical-data-extraction-ai-17s3.vercel.app
**Backend API:** https://medical-data-extraction-ai-1.onrender.com

---

## Features

- **Email-based authentication** with JWT (access + refresh tokens)
- **Prescription upload** with OCR text extraction (Tesseract)
- **Rule-based diet plan engine** — detects conditions (diabetes, anemia, high cholesterol, hypertension, thyroid) from medicine names and condition phrases in the OCR'd text, then generates a rotating 7-day meal plan
- **QR code generation** for every prescription — scanning it opens a public record page (patient name, age, blood group, extracted report) with no login required
- **Dashboard** with sidebar navigation: Dashboard (summary + recent scans), My Records (search/filter/delete), Profile (view/edit health details)
- **Cloud file storage** via Cloudinary — uploads persist independently of server restarts
- **Responsive, custom-designed UI** — sage/teal + warm apricot color palette, Fraunces/Inter/IBM Plex Mono typography, a "week ribbon" motif representing the 7-day plan

---

## Tech Stack

**Backend**
- Django 5 + Django REST Framework
- PostgreSQL (via Render)
- JWT auth (`djangorestframework-simplejwt`)
- Tesseract OCR (`pytesseract`)
- QR generation (`qrcode`)
- Cloudinary (media storage)
- Gunicorn + Docker for deployment

**Frontend**
- React + Vite
- React Router
- Axios
- react-hot-toast

**Hosting**
- Backend: Render (Docker web service + managed Postgres)
- Frontend: Vercel

---

## Project Structure

```
medical ai/
├── backend/
│   ├── core/                # Django project settings, urls
│   ├── accounts/             # Custom user model, auth (register/login/profile)
│   ├── prescriptions/        # Upload, OCR, QR generation, public record view
│   ├── dietplan/             # Diet plan generation logic
│   ├── Dockerfile
│   └── requirements.txt
│
└── frontend/
    └── src/
        ├── api/               # axios instance + endpoint wrappers
        ├── components/        # Sidebar, DashboardLayout, WeekRibbon, etc.
        ├── context/           # AuthContext
        ├── pages/             # Login, Register, Home, Records, Profile, Upload, Report, PublicPatientRecord
        └── routes/            # AppRoutes.jsx
```

---

## Local Setup

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```
Requires Tesseract OCR installed locally (Windows: https://github.com/UB-Mannheim/tesseract/wiki).

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Update `frontend/src/api/axiosInstance.js` and `publicApi.js` to point at `http://127.0.0.1:8000/api` for local development.

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/accounts/register/` | Create account |
| POST | `/api/accounts/login/` | Login, returns JWT tokens |
| GET/PUT | `/api/accounts/profile/` | View/update profile |
| POST | `/api/prescriptions/upload/` | Upload prescription image, runs OCR + QR generation |
| GET | `/api/prescriptions/my-records/` | List user's prescriptions |
| DELETE | `/api/prescriptions/<id>/delete/` | Delete a prescription |
| GET | `/api/prescriptions/public/<token>/` | Public record view (no auth) |
| POST | `/api/dietplan/generate/<prescription_id>/` | Generate/fetch diet plan |
| GET | `/api/dietplan/<prescription_id>/` | Fetch existing diet plan |

---

## License

Built as a personal/academic project.
