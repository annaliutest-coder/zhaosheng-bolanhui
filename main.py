import os
import io
import csv
from datetime import datetime
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Depends
from fastapi.responses import StreamingResponse
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel, EmailStr
from sqlalchemy import create_engine, Column, Integer, String, DateTime, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

# Google Generative AI
try:
    from google import genai
    GENAI_AVAILABLE = True
except ImportError:
    GENAI_AVAILABLE = False

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./students.db")

# Handle PostgreSQL URL format for some cloud providers
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# SSL configuration for cloud PostgreSQL
connect_args = {}
if "sqlite" in DATABASE_URL:
    connect_args = {"check_same_thread": False}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# Models
class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), nullable=False, unique=True)
    check_in_time = Column(DateTime, default=datetime.utcnow)
    letter = Column(String(2000), nullable=True)


# Pydantic schemas
class CheckInRequest(BaseModel):
    name: str
    email: EmailStr


class StudentResponse(BaseModel):
    id: int
    name: str
    email: str
    check_in_time: str
    letter: str | None

    class Config:
        from_attributes = True


class AnalyticsResponse(BaseModel):
    date: str
    count: int


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# AI Letter Generation
def generate_welcome_letter(student_name: str) -> str:
    """Generate a personalized welcome letter using Gemini AI."""
    api_key = os.getenv("GEMINI_API_KEY")

    if not GENAI_AVAILABLE or not api_key:
        return f"親愛的 {student_name}，歡迎來到 ABC 系！我們很高興您參加了我們的招生博覽會。期待在未來的學期與您相見！"

    try:
        client = genai.Client(api_key=api_key)
        prompt = f"""你是一位大學系所的招生代表。請為一位名叫「{student_name}」的學生撰寫一封簡短、溫馨的歡迎信，
        歡迎他們參加招生博覽會。信件應該：
        1. 用繁體中文撰寫
        2. 約100-150字
        3. 熱情且專業
        4. 鼓勵學生進一步了解本系
        請直接提供信件內容，不需要標題或額外說明。"""

        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
        )
        return response.text.strip()
    except Exception as e:
        print(f"AI generation error: {e}")
        return f"親愛的 {student_name}，歡迎來到 ABC 系！我們很高興您參加了我們的招生博覽會。期待在未來的學期與您相見！"


# Lifespan for database initialization
@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


# FastAPI app
app = FastAPI(title="招生博覽會簽到系統", lifespan=lifespan)


# API Routes
@app.post("/api/checkin", response_model=StudentResponse)
def check_in(request: CheckInRequest, db: Session = Depends(get_db)):
    """Register a new student check-in."""
    # Check if email already exists
    existing = db.query(Student).filter(Student.email == request.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="此 Email 已經登記過了")

    # Generate welcome letter
    letter = generate_welcome_letter(request.name)

    # Create student record
    student = Student(
        name=request.name,
        email=request.email,
        letter=letter
    )
    db.add(student)
    db.commit()
    db.refresh(student)

    return StudentResponse(
        id=student.id,
        name=student.name,
        email=student.email,
        check_in_time=student.check_in_time.isoformat(),
        letter=student.letter
    )


@app.get("/api/students", response_model=list[StudentResponse])
def get_students(db: Session = Depends(get_db)):
    """Get all registered students."""
    students = db.query(Student).order_by(Student.check_in_time.desc()).all()
    return [
        StudentResponse(
            id=s.id,
            name=s.name,
            email=s.email,
            check_in_time=s.check_in_time.isoformat(),
            letter=s.letter
        )
        for s in students
    ]


@app.get("/api/analytics", response_model=list[AnalyticsResponse])
def get_analytics(db: Session = Depends(get_db)):
    """Get daily check-in analytics."""
    results = (
        db.query(
            func.date(Student.check_in_time).label("date"),
            func.count(Student.id).label("count")
        )
        .group_by(func.date(Student.check_in_time))
        .order_by(func.date(Student.check_in_time))
        .all()
    )
    return [AnalyticsResponse(date=str(r.date), count=r.count) for r in results]


@app.get("/api/export")
def export_csv(db: Session = Depends(get_db)):
    """Export all students to CSV."""
    students = db.query(Student).order_by(Student.check_in_time.desc()).all()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "姓名", "Email", "簽到時間"])

    for s in students:
        writer.writerow([s.id, s.name, s.email, s.check_in_time.isoformat()])

    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=students.csv"}
    )


# Serve static files (for production build)
if os.path.exists("dist"):
    app.mount("/assets", StaticFiles(directory="dist/assets"), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        file_path = f"dist/{full_path}"
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse("dist/index.html")


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8080))
    uvicorn.run(app, host="0.0.0.0", port=port)
