import uuid


def generate_id() -> str:
    """Generate a UUID4 string for use as an ID."""
    return str(uuid.uuid4())
