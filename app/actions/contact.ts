'use server';

import { ContactFormSchema, FormState } from '@/app/lib/definitions';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function submitContact(
  _prevState: FormState | undefined,
  formData: FormData,
): Promise<FormState> {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const message = formData.get('message') as string;

  // Validate with Zod
  const validatedFields = ContactFormSchema.safeParse({
    name,
    email,
    message,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const response = await fetch(`${API_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: validatedFields.data.name,
        email: validatedFields.data.email,
        message: validatedFields.data.message,
      }),
    });

    if (!response.ok) {
      return {
        message: 'Failed to send message. Please try again.',
      };
    }

    return {
      message: 'Message sent successfully! We will get back to you soon.',
    };
  } catch {
    return {
      message: 'An error occurred. Please try again.',
    };
  }
}
