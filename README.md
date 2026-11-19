# Dr. Fatima Sultana - Portfolio

## Run it
```bash
# Backend
cd backend && python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
django-admin startproject config .        # then merge config/settings_snippet.py into settings.py
python manage.py makemigrations clinic && python manage.py migrate
python manage.py seed && python manage.py createsuperuser
python manage.py runserver

# Frontend (new terminal)
cd frontend && npm install && npm run dev   # http://localhost:5173, /api proxies to Django
```
In `/admin`: add each hospital's street address, map link and visiting hours (Availability rows).
Without Availability rows no booking slots appear.

## API
| Method | Route | Purpose |
|---|---|---|
| GET | /api/profile/ | doctor info + qualifications |
| GET | /api/services/ , /api/services/<slug>/ | 10 services |
| GET | /api/locations/ | hospitals |
| GET | /api/availability/?location=1&date=YYYY-MM-DD | free slots |
| POST | /api/appointments/ | book (throttled, slot re-checked, DB unique constraint) |
| POST | /api/contact/ | contact message |
| GET/POST | /api/testimonials/ | approved reviews / submit for moderation |

## Design tokens
ink #0A2540 · deep #0B4A8F · cyan #12A4C6 / #D9F1F7 · lilac #B79BDB / #EFE7F8 · mist #F3F8FC
Type: Bricolage Grotesque (display) + Figtree (body).
