import { z } from 'zod';
import type { JWTPayload } from 'jose';

// Role type
export type Role = 'lawyer' | 'client' | 'employee';

// User type
export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

// Session payload
export interface SessionPayload extends JWTPayload {
  userId: string;
  email: string;
  role: Role;
  apiToken: string;
  expiresAt: number;
}

// Form state for server actions
export interface FormState {
  message?: string;
  errors?: Record<string, string[]>;
}

// Zod schemas for validation

export const SignupFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters' })
    .max(100, { message: 'Name must be less than 100 characters' }),
  email: z
    .string()
    .email({ message: 'Invalid email address' })
    .max(255, { message: 'Email must be less than 255 characters' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .max(255, { message: 'Password must be less than 255 characters' }),
  role: z.enum(['lawyer', 'client', 'employee']),
});

export type SignupFormData = z.infer<typeof SignupFormSchema>;

export const LoginFormSchema = z.object({
  email: z
    .string()
    .email({ message: 'Invalid email address' })
    .max(255, { message: 'Email must be less than 255 characters' }),
  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .max(255, { message: 'Password must be less than 255 characters' }),
});

export type LoginFormData = z.infer<typeof LoginFormSchema>;

export const ContactFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters' })
    .max(100, { message: 'Name must be less than 100 characters' }),
  email: z
    .string()
    .email({ message: 'Invalid email address' })
    .max(255, { message: 'Email must be less than 255 characters' }),
  message: z
    .string()
    .min(10, { message: 'Message must be at least 10 characters' })
    .max(5000, { message: 'Message must be less than 5000 characters' }),
});

export type ContactFormData = z.infer<typeof ContactFormSchema>;
