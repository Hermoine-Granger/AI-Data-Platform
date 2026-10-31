import uvicorn
from fastapi import FastAPI

from controller.main import router
from middleware.middleware import configure_middleware


app = FastAPI(title="Beam Ingestion API", version="0.1.0")
configure_middleware(app)
app.include_router(router)


if __name__ == "__main__":
	uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=True)
