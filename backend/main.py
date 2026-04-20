from fastapi import FastAPI
from pathlib import Path
import uvicorn

try:
    from .app.core.config import settings
except ImportError:
    from app.core.config import settings

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}


if __name__ == "__main__":
    current_dir = Path(__file__).resolve().parent
    app_target = "main:app" if Path.cwd().resolve() == current_dir else "backend.main:app"

    uvicorn.run(
        app_target,
        host=settings.APP_HOST,
        port=settings.APP_PORT,
        reload=settings.APP_RELOAD,
    )
