import logging
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/contact", tags=["contact"])


class ContactRequest(BaseModel):
    """Request model for contact form submission."""
    name: str
    email: EmailStr
    message: str


@router.post("", status_code=status.HTTP_200_OK)
async def submit_contact(contact: ContactRequest):
    """
    Submit a contact form message.
    
    This endpoint accepts contact form submissions and logs them.
    In a production system, this would send an email or store in a database.
    """
    logger.info(f"Contact form submission from {contact.email}: {contact.name}")
    
    # In a real application, you would:
    # 1. Send an email to the support team
    # 2. Store the message in a database
    # 3. Send a confirmation email to the user
    
    return {
        "message": "Thank you for your message. We will get back to you soon.",
        "status": "success",
    }
