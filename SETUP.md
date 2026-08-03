# Buland Awaaz — NGO Demo Site (Gurugram)

Demo website for Buland Awaaz, a Gurugram-based NGO (child rights, education, women's empowerment).
React frontend + FastAPI backend + MongoDB + Claude AI chatbot.

## Features
- Animated editorial homepage (hero, impact counters, manifesto, programs, news/events)
- EN / हिंदी language toggle (full site + news content)
- Join Buland Awaaz membership form, Volunteer form, Contact form
- Public "Awaaz Wall" (/supporters) listing members
- AI chatbot "Buland Mitra" (Claude, Hinglish by default, streaming)
- Fully responsive (mobile hamburger menu, zero horizontal overflow)
- Social share card (Open Graph + Twitter meta)

## Setup

### 1. Backend
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env   # phir .env me sahi values bharein
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```
Needs MongoDB running (MONGO_URL in .env). Admin user auto-seeds from ADMIN_EMAIL/ADMIN_PASSWORD.

### 2. Frontend
```bash
cd frontend
yarn install
cp .env.example .env   # REACT_APP_BACKEND_URL apne backend ka URL daalein
yarn start
```
Site: http://localhost:3000 · Awaaz Wall: http://localhost:3000/supporters

## Important
- `.env` files kabhi GitHub pe upload MAT karna — usme secret keys hoti hain. Sirf `.env.example` share karo.
- All site content is SAMPLE demo data.
