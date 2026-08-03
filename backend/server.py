from dotenv import load_dotenv
load_dotenv()

import json
import logging
import os
import uuid
from datetime import datetime, timedelta, timezone
from typing import Optional

import bcrypt
import jwt
from emergentintegrations.llm.chat import LlmChat, StreamDone, TextDelta, UserMessage
from fastapi import APIRouter, Depends, FastAPI, HTTPException, Request, Response
from fastapi.responses import StreamingResponse
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr
from starlette.middleware.cors import CORSMiddleware

mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

app = FastAPI()
api_router = APIRouter(prefix="/api")

JWT_SECRET = os.environ["JWT_SECRET"]
JWT_ALGORITHM = "HS256"
EMERGENT_LLM_KEY = os.environ.get("EMERGENT_LLM_KEY", "")
FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:3000")

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


# ---------------- Auth ----------------

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "type": "access",
        "exp": datetime.now(timezone.utc) + timedelta(hours=24),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


async def get_current_user(request: Request):
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0, "password_hash": 0})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


class LoginIn(BaseModel):
    email: EmailStr
    password: str


@api_router.post("/auth/login")
async def login(payload: LoginIn, request: Request, response: Response):
    email = payload.email.lower()
    identifier = f"{request.client.host}:{email}"
    attempts = await db.login_attempts.find_one({"identifier": identifier})
    if attempts and attempts.get("count", 0) >= 5:
        last = datetime.fromisoformat(attempts["last_attempt"])
        if datetime.now(timezone.utc) - last < timedelta(minutes=15):
            raise HTTPException(status_code=429, detail="Too many failed attempts. Try again in 15 minutes.")
        await db.login_attempts.delete_one({"identifier": identifier})

    user = await db.users.find_one({"email": email})
    if not user or not verify_password(payload.password, user["password_hash"]):
        await db.login_attempts.update_one(
            {"identifier": identifier},
            {"$inc": {"count": 1}, "$set": {"last_attempt": now_iso()}},
            upsert=True,
        )
        raise HTTPException(status_code=401, detail="Invalid email or password")

    await db.login_attempts.delete_one({"identifier": identifier})
    token = create_access_token(user["id"], email)
    response.set_cookie(
        key="access_token", value=token, httponly=True,
        secure=True, samesite="none", max_age=86400, path="/",
    )
    return {"id": user["id"], "email": email, "name": user.get("name", "Admin"), "role": user.get("role", "admin")}


@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    return {"status": "ok"}


@api_router.get("/auth/me")
async def me(user=Depends(get_current_user)):
    return user


# ---------------- News & Events CMS ----------------

class ContentIn(BaseModel):
    title: str
    type: str = "news"
    date: str = ""
    summary: str = ""
    body: str = ""
    image_url: Optional[str] = ""
    published: bool = True


@api_router.get("/content")
async def public_content():
    return await db.content.find({"published": True}, {"_id": 0}).sort("date", -1).to_list(100)


@api_router.get("/admin/content")
async def admin_content(user=Depends(get_current_user)):
    return await db.content.find({}, {"_id": 0}).sort("date", -1).to_list(200)


@api_router.post("/admin/content")
async def create_content(payload: ContentIn, user=Depends(get_current_user)):
    doc = payload.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["created_at"] = now_iso()
    await db.content.insert_one({**doc})
    return doc


@api_router.put("/admin/content/{content_id}")
async def update_content(content_id: str, payload: ContentIn, user=Depends(get_current_user)):
    result = await db.content.update_one({"id": content_id}, {"$set": payload.model_dump()})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Content not found")
    doc = await db.content.find_one({"id": content_id}, {"_id": 0})
    return doc


@api_router.delete("/admin/content/{content_id}")
async def delete_content(content_id: str, user=Depends(get_current_user)):
    result = await db.content.delete_one({"id": content_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Content not found")
    return {"status": "ok"}


# ---------------- Forms ----------------

class ContactIn(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = ""
    message: str


class VolunteerIn(BaseModel):
    name: str
    email: EmailStr
    phone: str
    interest: str = "General"
    message: Optional[str] = ""


@api_router.post("/forms/contact")
async def submit_contact(payload: ContactIn):
    doc = payload.model_dump()
    doc.update({"id": str(uuid.uuid4()), "created_at": now_iso()})
    await db.contacts.insert_one({**doc})
    return {"status": "ok"}


@api_router.post("/forms/volunteer")
async def submit_volunteer(payload: VolunteerIn):
    doc = payload.model_dump()
    doc.update({"id": str(uuid.uuid4()), "created_at": now_iso()})
    await db.volunteers.insert_one({**doc})
    return {"status": "ok"}


class JoinIn(BaseModel):
    name: str
    phone: str
    email: EmailStr
    city: str
    help_with: str = "General"
    reason: Optional[str] = ""


@api_router.post("/forms/join")
async def submit_join(payload: JoinIn):
    doc = payload.model_dump()
    doc.update({"id": str(uuid.uuid4()), "created_at": now_iso()})
    await db.joins.insert_one({**doc})
    return {"status": "ok"}


@api_router.get("/admin/submissions")
async def admin_submissions(user=Depends(get_current_user)):
    volunteers = await db.volunteers.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    contacts = await db.contacts.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    joins = await db.joins.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return {"volunteers": volunteers, "contacts": contacts, "joins": joins}


# ---------------- AI Chatbot (Claude) ----------------

NGO_SYSTEM_PROMPT = """You are "Buland Mitra", the official AI assistant of Buland Awaaz, a grassroots NGO based in Gurugram, Haryana, India.

About Buland Awaaz:
- The name means "strong voice" (buland awaaz) in Hindi — the organisation exists to amplify voices that go unheard.
- Child rights: works to end child labour, child marriage and child abuse; runs door-to-door surveys and family counselling to enrol out-of-school children into schools.
- Women's empowerment: campaigns against dowry, violence and discrimination; promotes dignity, equality and education for girls and women.
- Community outreach: awareness campaigns in villages and urban communities across Haryana, Rajasthan and Punjab; took part in Gurugram's "Good Morning Gurugram" cleanliness and health-awareness campaign.
- Vision: a society free of child labour, child marriage and child abuse, where every child is in school and every woman's voice is heard.
- Visitors can join as volunteers or reach the team through the Volunteer and Contact forms on this website.

Rules:
- Answer only questions about Buland Awaaz, its causes (child rights, education, women's empowerment), its campaigns, volunteering and getting involved. Politely decline unrelated questions.
- Keep answers short (2-4 sentences), warm and energetic.
- If asked for exact addresses, phone numbers, registration numbers or payment details, say the team shares verified details directly and suggest the contact form.
- If the visitor writes in Hindi or Hinglish, reply in the same language."""

chat_sessions = {}


class ChatIn(BaseModel):
    session_id: str
    message: str


@api_router.post("/chat")
async def chat(payload: ChatIn):
    if not EMERGENT_LLM_KEY:
        raise HTTPException(status_code=503, detail="Chat is not configured")
    session_id = payload.session_id[:64]
    llm_chat = chat_sessions.get(session_id)
    if llm_chat is None:
        history = await db.chat_messages.find({"session_id": session_id}).sort("created_at", 1).to_list(20)
        system = NGO_SYSTEM_PROMPT
        if history:
            lines = "\n".join(
                f"{'Visitor' if m['role'] == 'user' else 'Assistant'}: {m['content']}" for m in history[-10:]
            )
            system += f"\n\nConversation so far:\n{lines}\n\nContinue this conversation naturally."
        llm_chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=session_id,
            system_message=system,
        ).with_model("anthropic", "claude-sonnet-4-6")
        chat_sessions[session_id] = llm_chat

    await db.chat_messages.insert_one(
        {"session_id": session_id, "role": "user", "content": payload.message, "created_at": now_iso()}
    )

    collected = []

    async def event_generator():
        try:
            async for ev in llm_chat.stream_message(UserMessage(text=payload.message)):
                if isinstance(ev, TextDelta):
                    collected.append(ev.content)
                    yield f"data: {json.dumps({'delta': ev.content})}\n\n"
                elif isinstance(ev, StreamDone):
                    break
        except Exception:
            logger.exception("chat stream error")
            yield f"data: {json.dumps({'error': 'The assistant is unavailable right now. Please try again shortly.'})}\n\n"
        full = "".join(collected)
        if full:
            await db.chat_messages.insert_one(
                {"session_id": session_id, "role": "assistant", "content": full, "created_at": now_iso()}
            )
        yield "data: [DONE]\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


# ---------------- Seed & startup ----------------

SEED_CONTENT = [
    {
        "id": str(uuid.uuid4()),
        "title": "Good Morning Gurugram: cleanliness & health awareness drive",
        "type": "news",
        "date": "2026-06-28",
        "summary": "Buland Awaaz joined residents and students for the Good Morning Gurugram campaign — carrying the message of clean surroundings and healthy habits across the city.",
        "body": "",
        "image_url": "https://images.unsplash.com/photo-1738854710710-4d3714df5186?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjh8MHwxfHNlYXJjaHwzfHxwcm90ZXN0JTIwYWN0aXZpc20lMjBpbmRpYXxlbnwwfHx8fDE3ODU3Mzc4MzF8MA&ixlib=rb-4.1.0&q=85",
        "published": True,
        "created_at": now_iso(),
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Awareness march against child marriage",
        "type": "news",
        "date": "2026-06-15",
        "summary": "Volunteers and community members marched to spread awareness on the harms of child marriage and the right of every girl to education and choice.",
        "body": "",
        "image_url": "https://images.unsplash.com/photo-1609252509229-364936a1d1a2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzN8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBydXJhbCUyMHdvbWVufGVufDB8fHx8MTc4NTczNzgzMXww&ixlib=rb-4.1.0&q=85",
        "published": True,
        "created_at": now_iso(),
    },
    {
        "id": str(uuid.uuid4()),
        "title": "School enrollment camp: door-to-door survey drive",
        "type": "event",
        "date": "2026-08-02",
        "summary": "Join our volunteers as we go door to door, identify out-of-school children, counsel families and help with school admissions. Gurugram. Volunteers welcome.",
        "body": "",
        "image_url": "https://images.unsplash.com/photo-1524069290683-0457abfe42c3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBjaGlsZHJlbiUyMGVkdWNhdGlvbnxlbnwwfHx8fDE3ODU3Mzc4MzF8MA&ixlib=rb-4.1.0&q=85",
        "published": True,
        "created_at": now_iso(),
    },
]


async def seed_admin():
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@example.com").lower()
    admin_password = os.environ.get("ADMIN_PASSWORD", "admin123")
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one(
            {
                "id": str(uuid.uuid4()),
                "email": admin_email,
                "password_hash": hash_password(admin_password),
                "name": "Buland Awaaz Team",
                "role": "admin",
                "created_at": now_iso(),
            }
        )
        logger.info("Seeded admin user %s", admin_email)
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one({"email": admin_email}, {"$set": {"password_hash": hash_password(admin_password)}})


@app.on_event("startup")
async def startup():
    await db.users.create_index("email", unique=True)
    await db.login_attempts.create_index("identifier")
    await db.chat_messages.create_index([("session_id", 1), ("created_at", 1)])
    await seed_admin()
    if await db.content.count_documents({}) == 0:
        await db.content.insert_many([{**item} for item in SEED_CONTENT])
        logger.info("Seeded %d content items", len(SEED_CONTENT))


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=[FRONTEND_URL, "http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)
