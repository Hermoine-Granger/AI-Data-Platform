from collections.abc import Sequence

from fastapi import APIRouter, HTTPException

from model.main import LoginRequest, PipelineRequest, PipelineResponse, WordCount
from service.apache_beam import run_batch


router = APIRouter()


@router.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@router.post("/api/login")
def login(request: LoginRequest) -> dict[str, str]:
    if request.username != "admin" or request.password != "beam":
        raise HTTPException(status_code=401, detail="Invalid username or password")
    return {"token": "local-demo-token", "username": request.username}


def _count_words(lines: Sequence[str]) -> tuple[dict[str, int], int]:
    return run_batch(lines)


@router.post("/api/pipeline/run", response_model=PipelineResponse)
def run_pipeline(request: PipelineRequest) -> PipelineResponse:
    lines = [line.strip() for line in request.lines if line.strip()]
    if not lines:
        raise HTTPException(status_code=422, detail="At least one non-empty line is required")

    counts, words_processed = _count_words(lines)
    return PipelineResponse(
        counts=[WordCount(word=word, count=count) for word, count in sorted(counts.items())],
        records_processed=len(lines),
        words_processed=words_processed,
    )