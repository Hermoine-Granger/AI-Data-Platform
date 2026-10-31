from pydantic import BaseModel, Field

class LoginRequest(BaseModel):
    username: str = Field(min_length=1)
    password: str = Field(min_length=1)


class PipelineRequest(BaseModel):
    lines: list[str] = Field(min_length=1)


class WordCount(BaseModel):
    word: str
    count: int


class PipelineResponse(BaseModel):
    counts: list[WordCount]
    records_processed: int
    words_processed: int
    runner: str = "DirectRunner"
