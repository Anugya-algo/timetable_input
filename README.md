# AcadSync Data Entry Admin

A production-ready, internal data entry system for collecting and validating university timetable data.

## Tech Stack

### Frontend
- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS** (Blue/White theme)
- **Clerk** - Authentication (Keyless mode supported)
- **Lucide React** - Icons

### Backend
- **Django 5** + Django REST Framework
- **SQLite** (dev) / PostgreSQL (production)
- **Cloudinary** - PDF cloud storage
- **JWT** - Clerk token verification

## Project Structure

```
timetable_input/
├── backend/                 # Django API
│   ├── config/             # Django settings
│   ├── core/               # Auth middleware
│   ├── documents/          # PDF upload (Cloudinary)
│   ├── meta/               # Faculty, Room, Subject models
│   ├── timetable/          # TimetableEntry model
│   └── requirements.txt
├── frontend/               # Next.js App
│   ├── app/
│   │   ├── dashboard/      # Protected pages
│   │   └── page.tsx        # Landing page
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

**Environment (backend/.env):**
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

**Clerk Keyless Mode:** No API keys needed for development. Clerk auto-configures.

## Features

- ✅ **Department Isolation** - Users only access their department data
- ✅ **PDF Upload** - Cloudinary cloud storage
- ✅ **Validation** - Prevents scheduling conflicts
- ✅ **Modern UI** - Clean blue/white theme
- ✅ **Secure Auth** - Clerk JWT verification
