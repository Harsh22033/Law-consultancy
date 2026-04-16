from backend.models.case import CaseCreate, CaseOut
from backend.utils.id import generate_id

# In-memory store for cases
cases_db: dict[str, CaseOut] = {}


def create(case_create: CaseCreate, lawyer_id: str) -> CaseOut:
    """Create a new case."""
    case_id = generate_id()
    case = CaseOut(
        id=case_id,
        title=case_create.title,
        status=case_create.status,
        lawyer_id=lawyer_id,
        client_id=case_create.client_id,
    )
    cases_db[case_id] = case
    return case


def get_all() -> list[CaseOut]:
    """Get all cases."""
    return list(cases_db.values())


def get_by_id(case_id: str) -> CaseOut | None:
    """Get a case by ID."""
    return cases_db.get(case_id)


def update_status(case_id: str, status: str) -> CaseOut | None:
    """Update case status."""
    case = cases_db.get(case_id)
    if case:
        case.status = status
        cases_db[case_id] = case
    return case
