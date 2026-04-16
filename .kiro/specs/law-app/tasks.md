# Implementation Plan: Law App

## Overview

Full-stack implementation: FastAPI backend first (auth, cases, tasks), then Next.js frontend (session, middleware, pages, dashboards). Each task builds on the previous and ends with everything wired together.

## Tasks

- [x] 1. Set up backend project structure
  - Create `backend/` directory with `main.py`, `requirements.txt`, and folder structure: `routers/`, `services/`, `models/`, `store/`, `auth/`, `utils/`
  - `requirements.txt`: `fastapi`, `uvicorn`, `pydantic`, `python-jose[cryptography]`, `passlib[bcrypt]`, `slowapi`, `pytest`, `hypothesis`, `httpx`
  - Create `backend/utils/id.py` with `generate_id() -> str` using `uuid.uuid4()`; reference this helper in all user, case, and task creation
  - Wire up FastAPI app in `main.py` with CORS middleware (allowed origins from `ALLOWED_ORIGINS` env var), a global exception handler that returns `{ "detail": "Internal server error" }` without leaking stack traces, and request logging middleware
  - _Requirements: 12.4, 12.8, 12.9_

- [x] 2. Implement backend auth — models, store, JWT helpers
  - [x] 2.1 Create `backend/models/user.py` with `UserCreate`, `UserOut`, `UserInDB` Pydantic models
    - `UserInDB` includes `hashed_password` field
    - _Requirements: 3.2, 4.2, 12.3_
  - [x] 2.2 Create `backend/store/users.py` with in-memory `dict[str, UserInDB]` and helpers: `find_by_email`, `create_user`, `get_by_id`
    - Hash passwords with `passlib` bcrypt on `create_user`; use `generate_id()` for user IDs
    - _Requirements: 3.2, 4.2, 12.3_
  - [x] 2.3 Create `backend/auth/jwt.py` with `create_access_token(sub, role)` (15-minute expiry) and `create_refresh_token(sub)` (7-day expiry) and `verify_token(token)` using `python-jose`
    - Load `JWT_SECRET` and `JWT_ALGORITHM = "HS256"` from environment variables via `os.getenv`
    - JWT payload: `{ sub, role, exp, type }` where `type` is `"access"` or `"refresh"`
    - _Requirements: 4.2, 4.6, 4.7, 12.4, 12.9_
  - [x] 2.4 Create `backend/auth/deps.py` with `get_current_user` FastAPI dependency
    - Extracts Bearer token from `Authorization` header, verifies it, returns user
    - Raises `HTTPException(401)` if missing or invalid
    - _Requirements: 5.1, 6.4, 7.3_

- [ ] 3. Implement backend auth router
  - [x] 3.1 Create `backend/routers/auth.py` with `POST /auth/signup`, `POST /auth/login`, `POST /auth/logout`, `POST /auth/refresh`
    - `signup`: validate body, check duplicate email (409), hash password, create user with `generate_id()`, return access + refresh tokens and `UserOut`
    - `login`: find user, verify password, return access + refresh tokens and `UserOut`; return 401 on failure
    - `refresh`: verify refresh token, issue new access token; return 401 if token invalid or expired
    - `logout`: stateless — return 200 (frontend deletes cookie)
    - Apply `slowapi` rate limiter: max 10 requests/minute per IP on signup, login, and refresh
    - _Requirements: 3.2, 3.3, 4.2, 4.3, 4.5, 4.6, 4.7, 12.7_
  - [x]* 3.2 Write pytest unit tests for auth router
    - Test successful signup returns token and user
    - Test duplicate email returns 409
    - Test successful login returns token
    - Test wrong password returns 401
    - _Requirements: 3.2, 3.3, 4.2, 4.3_

- [ ] 4. Implement backend cases and tasks
  - [ ] 4.1 Create `backend/models/case.py` and `backend/store/cases.py`
    - `CaseCreate`, `CaseOut` Pydantic models
    - In-memory `dict[str, CaseOut]` store with `get_all`, `create`, `update_status` helpers; use `generate_id()` for case IDs
    - _Requirements: 6.1, 6.2, 6.3_
  - [ ] 4.2 Create `backend/routers/cases.py` with `GET /cases`, `POST /cases`, `PUT /cases/{id}`
    - `GET`: filter by role — lawyer sees cases where `lawyer_id` matches, client sees cases where `client_id` matches
    - `POST` and `PUT`: require `lawyer` role, return 403 otherwise
    - All routes require auth via `get_current_user` dependency
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
  - [ ]* 4.3 Write property test for cases role enforcement (Property 6)
    - **Property 6: API role enforcement — cases**
    - **Validates: Requirements 6.5**
    - Use `hypothesis` to generate non-lawyer users; assert POST/PUT /cases returns 403
  - [ ] 4.4 Create `backend/models/task.py` and `backend/store/tasks.py`
    - `TaskCreate`, `TaskOut` Pydantic models
    - In-memory `dict[str, TaskOut]` store; use `generate_id()` for task IDs
    - _Requirements: 7.1, 7.2_
  - [ ] 4.5 Create `backend/routers/tasks.py` with `GET /tasks`, `POST /tasks`
    - Both routes require `employee` role, return 403 otherwise
    - `GET`: filter tasks where `assigned_to` matches current user id
    - _Requirements: 7.1, 7.2, 7.3, 7.4_
  - [ ]* 4.6 Write property test for tasks role enforcement (Property 7)
    - **Property 7: API role enforcement — tasks**
    - **Validates: Requirements 7.4**
    - Use `hypothesis` to generate non-employee users; assert GET/POST /tasks returns 403

- [ ] 5. Checkpoint — Backend tests pass
  - Ensure all pytest tests pass. Ask the user if questions arise.

- [ ] 5.1 Add health check endpoint
  - Add `GET /health` route in `main.py` returning `{ "status": "ok" }` with no auth required
  - _Requirements: 13.1, 13.2_

- [ ] 6. Set up frontend dependencies and infrastructure
  - Install `jose`, `zod`, `@types/jest`, `jest`, `ts-jest`, `fast-check`
  - Configure `jest.config.ts` with `ts-jest` preset and `@/` alias
  - Add `SESSION_SECRET` and `NEXT_PUBLIC_API_URL=http://localhost:8000` to `.env.local`
  - _Requirements: 4.2, 12.4_

- [ ] 7. Implement frontend session and validation library
  - [ ] 7.1 Create `app/lib/definitions.ts` with `Role`, `User`, `SessionPayload`, `FormState` types and Zod schemas: `SignupFormSchema`, `LoginFormSchema`, `ContactFormSchema`
    - _Requirements: 3.4, 3.5, 3.6, 4.4, 1.6_
  - [ ]* 7.2 Write property test for signup validation (Property 2)
    - **Property 2: Signup validation rejects invalid inputs**
    - **Validates: Requirements 3.4, 3.5, 3.6**
  - [ ]* 7.3 Write property test for login validation (Property 3)
    - **Property 3: Login validation rejects empty fields**
    - **Validates: Requirements 4.4**
  - [ ]* 7.4 Write property test for contact form validation (Property 4)
    - **Property 4: Contact form validation rejects incomplete submissions**
    - **Validates: Requirements 1.6**
  - [ ] 7.5 Create `app/lib/session.ts` with `encrypt`, `decrypt`, `createSession(userId, role, apiToken)`, `deleteSession`
    - Use `jose` HS256, 7-day expiry, HttpOnly cookie
    - _Requirements: 4.2, 4.5, 5.1_
  - [ ]* 7.6 Write property test for session round-trip (Property 1)
    - **Property 1: Session round-trip**
    - **Validates: Requirements 4.2, 5.1**
  - [ ] 7.7 Create `app/lib/api.ts` with typed fetch helpers: `apiPost`, `apiGet`
    - Reads `apiToken` from session and forwards as `Authorization: Bearer` header
    - On 401 response, automatically redirect to `/login` (token expired or invalid)
    - _Requirements: 6.1, 7.1, 8.2, 9.2, 10.2, 4.6_

- [ ] 8. Implement route protection middleware
  - [ ] 8.1 Create `middleware.ts` at project root
    - Match `/dashboard/:path*`, `/login`, `/signup`
    - Unauthenticated + dashboard → redirect `/login`
    - Authenticated + auth route → redirect `/dashboard/{role}`
    - Authenticated + wrong-role dashboard → redirect `/dashboard/{role}`
    - _Requirements: 5.1, 5.2, 5.3_
  - [ ]* 8.2 Write property test for role-based redirect invariant (Property 5)
    - **Property 5: Role-based redirect invariant**
    - **Validates: Requirements 5.2**
  - [ ]* 8.3 Write unit tests for middleware
    - Unauthenticated → `/dashboard/lawyer` redirects to `/login`
    - Lawyer session → `/dashboard/client` redirects to `/dashboard/lawyer`
    - Authenticated user → `/login` redirects to their dashboard

- [ ] 9. Implement auth Server Actions and auth pages
  - [ ] 9.1 Create `app/actions/auth.ts` with `signup`, `login`, `logout` Server Actions
    - `signup`: validate with Zod, call `POST /auth/signup`, call `createSession`, redirect to `/dashboard/{role}`
    - `login`: validate with Zod, call `POST /auth/login`, call `createSession`, redirect to `/dashboard/{role}`
    - `logout`: call `POST /auth/logout`, call `deleteSession`, redirect to `/`
    - _Requirements: 3.2, 3.3, 4.2, 4.3, 4.5_
  - [ ] 9.2 Create `app/(auth)/layout.tsx` — minimal layout without nav/footer
  - [ ] 9.3 Create `app/components/SignupForm.tsx` and `app/(auth)/signup/page.tsx`
    - Client component with `useActionState`, role selector
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_
  - [ ] 9.4 Create `app/components/LoginForm.tsx` and `app/(auth)/login/page.tsx`
    - Client component with `useActionState`
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ] 10. Build shared UI components and public pages
  - [ ] 10.1 Create `app/components/Navbar.tsx` — reads session, shows auth/dashboard links conditionally; hamburger on mobile
    - _Requirements: 2.1, 2.2, 2.3, 11.2_
  - [ ] 10.2 Create `app/components/Footer.tsx`
    - _Requirements: 2.4_
  - [ ] 10.3 Create `app/(public)/layout.tsx` wrapping children with `Navbar` and `Footer`
  - [ ] 10.4 Create `app/(public)/page.tsx` (Home), `about/page.tsx`, `terms/page.tsx`
    - _Requirements: 1.1, 1.2, 1.3_
  - [ ] 10.5 Create `app/components/ContactForm.tsx` and `app/(public)/contact/page.tsx`
    - Client component with `useActionState`, validates with `ContactFormSchema`
    - _Requirements: 1.4, 1.5, 1.6_

- [ ] 11. Build dashboard pages
  - [ ] 11.1 Create `app/dashboard/layout.tsx` — `DashboardShell` with sidebar nav and logout button
    - _Requirements: 4.5, 8.1, 9.1, 10.1_
  - [ ] 11.2 Create `app/dashboard/lawyer/page.tsx`
    - Fetch cases from `GET /cases` via `apiGet`, display active cases and client list
    - Placeholder links for case/client detail views
    - _Requirements: 8.1, 8.2, 8.3, 8.4_
  - [ ] 11.3 Create `app/dashboard/client/page.tsx`
    - Fetch cases from `GET /cases`, display status and deadlines
    - Placeholder "Message Lawyer" button
    - _Requirements: 9.1, 9.2, 9.3, 9.4_
  - [ ] 11.4 Create `app/dashboard/employee/page.tsx`
    - Fetch tasks from `GET /tasks` via `apiGet`, display pending tasks and activity summary
    - Placeholder links for task management and reporting
    - _Requirements: 10.1, 10.2, 10.3, 10.4_

- [ ] 12. Final checkpoint — Ensure all tests pass
  - Run `pytest` in `backend/` and `jest` in the frontend root. Ensure all tests pass. Ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Run the backend with: `uvicorn backend.main:app --reload --port 8000`
- Run the frontend with: `npm run dev`
- In-memory stores reset on server restart — intentional for initial implementation
- Property tests run minimum 100 iterations each
- Future Enhancement: Replace in-memory stores with a persistent database (PostgreSQL recommended) using an ORM such as SQLAlchemy; replace the frontend session store with a database-backed solution using Prisma if migrating to a JS/TS ORM
