# Timetable Data Ingestion System

A production-ready, backend-first system for collecting and validating university timetable data.

## Project Structure

*   `backend/`: Django REST Framework (Python)
*   `frontend/`: Next.js 14 App Router (TypeScript)

## Prerequisites

*   Python 3.10+
*   Node.js 18+
*   PostgreSQL (Optional for local dev, SQLite configured by default)
*   AWS S3 Bucket (for PDF storage - optional, can be added later)

## Quick Start

### 1. Backend (Django)

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Install dependencies
pip install django djangorestframework psycopg2-binary django-cors-headers pyjwt requests boto3

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Start server
python manage.py runserver
```

### 2. Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

That's it! Navigate to http://localhost:3000

**Clerk Keyless Mode**: The app uses Clerk for authentication. You do NOT need to sign up for Clerk or configure API keys to start developing. Clerk automatically runs in **keyless mode** and handles everything. When you're ready for production, you can claim your application from the prompt in the bottom-right corner.

## Environment Variables (Optional - For Production)

### Backend (`backend/.env`)
```env
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_STORAGE_BUCKET_NAME=your_bucket_name
AWS_S3_REGION_NAME=us-east-1
```

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api/v1
```

## Features

1.  **Department Isolation**: Users can only access data belonging to their department
2.  **Validation**: Prevents overlapping room bookings and double-booked faculty
3.  **S3 Integration**: Direct-to-S3 uploads via presigned URLs
4.  **Modern UI**: Blue/White minimal theme using Tailwind CSS
5.  **Keyless Auth**: Start developing immediately without Clerk account setup
