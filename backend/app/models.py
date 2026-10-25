from typing import Literal

from pydantic import BaseModel

Status = Literal["Completed", "Waiting", "Needs action", "Needs human confirmation"]


class Headline(BaseModel):
    study: str
    date: str
    time: str
    arrive_by: str


class Task(BaseModel):
    title: str
    detail: str
    status: Status
    source_doc_id: str
    quote: str


class Discrepancy(BaseModel):
    summary: str
    source_doc_ids: list[str]


class Blocker(BaseModel):
    title: str
    why: str
    status: Status
    source_doc_id: str
    quote: str


class Plan(BaseModel):
    headline: Headline
    tasks: list[Task]
    discrepancies: list[Discrepancy]
    blockers: list[Blocker]


class Grounding(BaseModel):
    source_doc_id: str
    quote: str


class DraftRequest(BaseModel):
    subject: str
    body: str
    grounding: list[Grounding]


class Answer(BaseModel):
    answered_by_documents: bool
    answer: str
    citations: list[Grounding]
    question_for_center: str
