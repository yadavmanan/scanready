from functools import lru_cache
from pathlib import Path

import pymupdf

DOCS_DIR = Path(__file__).resolve().parents[2] / "docs"

TITLES = {
    "01_imaging_referral.pdf": "Imaging referral",
    "02_appointment_email.pdf": "Appointment email",
    "03_mri_preparation_guide.pdf": "MRI preparation guide",
    "04_center_accessibility_info.pdf": "Center accessibility information",
    "05_insurance_letter.pdf": "Insurance letter",
}


def _extract(path: Path) -> str:
    with pymupdf.open(path) as pdf:
        return "\n".join(page.get_text() for page in pdf).strip()


@lru_cache(maxsize=1)
def load_documents() -> list[dict]:
    docs = []
    for path in sorted(DOCS_DIR.glob("*.pdf")):
        docs.append(
            {
                "id": path.name,
                "title": TITLES.get(path.name, path.stem.replace("_", " ")),
                "text": _extract(path),
            }
        )
    return docs
