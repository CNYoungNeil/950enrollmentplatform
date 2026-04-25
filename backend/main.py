from pathlib import Path

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

try:
    from .app.api import assignment_router, auth_router, course_router, material_router
    from .app.core.config import settings
except ImportError:
    from app.api import assignment_router, auth_router, course_router, material_router
    from app.core.config import settings

app = FastAPI(title="Course Collaboration Platform", version="0.1.0")

# ── CORS ────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Static file serving for uploads ─────────────────────────────────────────
uploads_dir = Path(settings.UPLOAD_DIR)
uploads_dir.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(uploads_dir)), name="uploads")

# ── Routers ──────────────────────────────────────────────────────────────────
app.include_router(auth_router)
app.include_router(course_router)
app.include_router(material_router)
app.include_router(assignment_router)


@app.get("/")
def root():
    return {"message": "Course Collaboration Platform API"}


if __name__ == "__main__":
    current_dir = Path(__file__).resolve().parent
    app_target = "main:app" if Path.cwd().resolve() == current_dir else "backend.main:app"

    uvicorn.run(
        app_target,
        host=settings.APP_HOST,
        port=settings.APP_PORT,
        reload=settings.APP_RELOAD,
    )
