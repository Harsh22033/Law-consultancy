'use server';

import { redirect } from 'next/navigation';
import { createSession, deleteSession } from '@/app/lib/session';
import { SignupFormSchema, LoginFormSchema, FormState } from '@/app/lib/definitions';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function signup(
  _prevState: FormState | undefined,
  formData: FormData,
): Promise<FormState> {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const role = formData.get('role') as string;

  // Validate with Zod
  const validatedFields = SignupFormSchema.safeParse({
    name,
    email,
    password,
    role,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: validatedFields.data.name,
        email: validatedFields.data.email,
        password: validatedFields.data.password,
        role: validatedFields.data.role,
      }),
    });

    if (response.status === 409) {
      return {
        message: 'Email already registered',
      };
    }

    if (!response.ok) {
      return {
        message: 'Failed to sign up. Please try again.',
      };
    }

    const data = await response.json();

    // Create session
    await createSession(
      data.user.id,
      data.user.email,
      data.user.role,
      data.access_token,
    );

    // Redirect to dashboard
    redirect(`/dashboard/${data.user.role}`);
  } catch {
    return {
      message: 'An error occurred. Please try again.',
    };
  }
}

export async function login(
  _prevState: FormState | undefined,
  formData: FormData,
): Promise<FormState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // Validate with Zod
  const validatedFields = LoginFormSchema.safeParse({
    email,
    password,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: validatedFields.data.email,
        password: validatedFields.data.password,
      }),
    });

    if (response.status === 401) {
      return {
        message: 'Invalid email or password',
      };
    }

    if (!response.ok) {
      return {
        message: 'Failed to log in. Please try again.',
      };
    }

    const data = await response.json();

    // Create session
    await createSession(
      data.user.id,
      data.user.email,
      data.user.role,
      data.access_token,
    );

    // Redirect to dashboard
    redirect(`/dashboard/${data.user.role}`);
  } catch {
    return {
      message: 'An error occurred. Please try again.',
    };
  }
}

export async function logout(): Promise<void> {
  await deleteSession();
  redirect('/');
}
