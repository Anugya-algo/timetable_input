# AcadSync — Timetable Data Entry & Admin Portal

A production-ready internal system for collecting university timetable data with a separate admin portal for PDF management.

## Tech Stack

### Frontend
- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS** (Blue/White theme)
- **Clerk** — User authentication (Keyless mode for dev)
- **Lucide React** — Icons

### Backend
- **Django 5** + Django REST Framework
- **SQLite** (dev) / PostgreSQL (production)
- **Cloudinary** — PDF cloud storage (with proxy download)

## Project Structure

```
timetable_input/
├── backend/                  # Django API
│   ├── config/              # Django settings
│   ├── core/                # Auth middleware
│   ├── documents/           # PDF upload & download proxy
│   │   ├── cloudinary_service.py  # Cloudinary SDK wrapper
│   │   ├── models.py        # ReferencePDF model
│   │   ├── views.py         # Upload, List, Download endpoints
│   │   └── urls.py          # /upload, /list, /download/<id>
│   ├── meta/                # Faculty, Room, Subject models
│   ├── timetable/           # TimetableEntry model
│   └── requirements.txt
├── frontend/                 # Next.js App
│   ├── app/
│   │   ├── admin/           # Admin portal (credential login + PDF viewer)
│   │   ├── dashboard/       # Protected user pages
│   │   │   └── upload-pdf/  # PDF upload page
│   │   └── page.tsx         # Landing page
│   ├── components/
│   └── lib/
└── README.md
```

## Quick Start

### 1. Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Linux/Mac

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

**Environment (`backend/.env`):**
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_secret
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000

**Environment (`frontend/.env.local`):**
```env
NEXT_PUBLIC_ADMIN_USERNAME=admin
NEXT_PUBLIC_ADMIN_PASSWORD=your_admin_password
```

**Clerk Keyless Mode:** No API keys needed for development. Clerk auto-configures.

## Features

- ✅ **Department Isolation** — Users only access their department data
- ✅ **PDF Upload** — Upload reference PDFs to Cloudinary
- ✅ **Admin Portal** — Separate credential-based login at `/admin` to view & download all uploaded PDFs
- ✅ **PDF Proxy Download** — Backend proxy bypasses Cloudinary CDN restrictions for seamless PDF access
- ✅ **Validation** — Prevents scheduling conflicts
- ✅ **Modern UI** — Clean blue/white theme
- ✅ **Secure Auth** — Clerk JWT verification for users, session-based auth for admin

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/documents/upload/` | Upload a PDF |
| GET | `/api/v1/documents/list/` | List all PDFs (returns proxy URLs) |
| GET | `/api/v1/documents/download/<id>/` | Download a PDF via backend proxy |

## Admin Access

The admin portal is at `/admin` on the frontend. It uses separate credentials (not Clerk) stored in environment variables. The admin can:
- View all uploaded PDFs
- Open PDFs in-browser via the backend proxy
- Download PDFs directly
- Search PDFs by filename or note
