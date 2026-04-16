# Requirements Document

## Introduction

A full-stack web application for a law firm built with Next.js 16 (frontend) and FastAPI (backend). The system supports three user roles — Lawyer, Client, and Employee — and provides public marketing pages, a credential-based authentication system, and role-specific dashboards. The backend exposes a REST API consumed by the frontend via HTTP.

## Glossary

- **App**: The complete system comprising the Next.js frontend and FastAPI backend
- **Frontend**: The Next.js 16 App Router web application
- **Backend**: The FastAPI Python service providing the REST API
- **Visitor**: An unauthenticated user browsing public pages
- **User**: An authenticated person with an assigned role
- **Lawyer**: A User with the `lawyer` role who manages cases and clients
- **Client**: A User with the `client` role who tracks their own cases
- **Employee**: A User with the `employee` role who handles internal operations
- **Dashboard**: The role-specific landing page shown after login
- **Auth_System**: The authentication and session management subsystem spanning both frontend and backend
- **Router**: The Next.js App Router responsible for navigation and route protection
- **API**: The FastAPI REST service
- **Access_Token**: A short-lived JWT used to authenticate API requests
- **Refresh_Token**: A long-lived token used to obtain a new Access_Token without re-authentication

---

## Requirements

### Requirement 1: Public Pages

**User Story:** As a Visitor, I want to browse public informational pages, so that I can learn about the firm before deciding to sign up or contact them.

#### Acceptance Criteria

1. THE Frontend SHALL render a Home page at the `/` route containing a hero section, a brief firm description, and a call-to-action linking to the Contact and Signup pages.
2. THE Frontend SHALL render an About page at the `/about` route containing information about the firm and its team.
3. THE Frontend SHALL render a Terms & Conditions page at the `/terms` route containing the full terms of service text.
4. THE Frontend SHALL render a Contact page at the `/contact` route containing a contact form with fields for name, email, and message.
5. WHEN a Visitor submits the contact form with all required fields filled, THE Frontend SHALL display a confirmation message.
6. IF a Visitor submits the contact form with any required field empty or invalid, THEN THE Frontend SHALL display a validation error for each invalid field without submitting the form.
7. WHEN a Visitor submits the contact form with valid data, THE Frontend SHALL send the form data to the API for persistence or email delivery.

---

### Requirement 2: Navigation

**User Story:** As a Visitor or User, I want consistent navigation across all pages, so that I can move between sections of the site easily.

#### Acceptance Criteria

1. THE Frontend SHALL render a top navigation bar on all public pages containing links to Home, About, Terms & Conditions, and Contact.
2. WHILE a User is authenticated, THE Frontend SHALL display a link to the User's Dashboard and a Logout button in the navigation bar.
3. WHILE a User is not authenticated, THE Frontend SHALL display Login and Signup links in the navigation bar.
4. THE Frontend SHALL render a footer on all public pages containing copyright information and links to Terms & Conditions and Contact.

---

### Requirement 3: Authentication — Signup

**User Story:** As a Visitor, I want to create an account with a chosen role, so that I can access the appropriate dashboard.

#### Acceptance Criteria

1. THE Frontend SHALL render a Signup page at the `/signup` route containing fields for full name, email address, password, and role selection (Lawyer, Client, Employee).
2. WHEN a Visitor submits the signup form with valid data, THE Auth_System SHALL call `POST /auth/signup` on the API, create a new User account, establish a session, and redirect the User to their role-specific Dashboard.
3. IF the API returns a conflict error for an already-registered email, THEN THE Frontend SHALL display an error message stating the email is already in use.
4. IF a Visitor submits the signup form with a password shorter than 8 characters, THEN THE Frontend SHALL display a validation error before submission.
5. IF a Visitor submits the signup form with an invalid email format, THEN THE Frontend SHALL display a validation error before submission.
6. IF a Visitor submits the signup form without selecting a role, THEN THE Frontend SHALL display a validation error before submission.

---

### Requirement 4: Authentication — Login

**User Story:** As a registered User, I want to log in with my credentials, so that I can access my dashboard.

#### Acceptance Criteria

1. THE Frontend SHALL render a Login page at the `/login` route containing fields for email address and password.
2. WHEN a User submits the login form with valid credentials, THE Auth_System SHALL call `POST /auth/login` on the API, receive a JWT token, store it in an HttpOnly cookie, and redirect the User to their role-specific Dashboard.
3. IF the API returns an authentication error, THEN THE Frontend SHALL display a generic error message without revealing which field is incorrect.
4. IF a User submits the login form with any field empty, THEN THE Frontend SHALL display a validation error before submission.
5. WHEN a User logs out, THE Auth_System SHALL call `POST /auth/logout`, destroy the session cookie, and redirect the User to the Home page.
6. THE Auth_System SHALL issue Access_Tokens with an expiration time of no more than 15 minutes.
7. THE Auth_System SHOULD issue a Refresh_Token alongside the Access_Token and expose a `POST /auth/refresh` endpoint to obtain a new Access_Token without requiring the User to log in again.

---

### Requirement 5: Route Protection

**User Story:** As a system operator, I want unauthenticated users to be blocked from dashboard routes, so that private data is never exposed without a valid session.

#### Acceptance Criteria

1. WHEN an unauthenticated Visitor navigates to any `/dashboard/*` route, THE Router SHALL redirect the Visitor to the `/login` page.
2. WHEN an authenticated User navigates to a dashboard route belonging to a different role, THE Router SHALL redirect the User to their own role-specific Dashboard.
3. WHEN an authenticated User navigates to `/login` or `/signup`, THE Router SHALL redirect the User to their role-specific Dashboard.

---

### Requirement 6: Cases API

**User Story:** As a Lawyer or Client, I want to access case data through the API, so that dashboards can display accurate case information.

#### Acceptance Criteria

1. THE API SHALL expose a `GET /cases` endpoint that returns a list of cases accessible to the authenticated User based on their role.
2. THE API SHALL expose a `POST /cases` endpoint that allows a Lawyer to create a new case with a title, status, lawyerId, and clientId.
3. THE API SHALL expose a `PUT /cases/{id}` endpoint that allows a Lawyer to update the status of an existing case.
4. IF an unauthenticated request is made to any `/cases` endpoint, THEN THE API SHALL return a 401 Unauthorized response.
5. IF a Client attempts to create or update a case, THEN THE API SHALL return a 403 Forbidden response.

---

### Requirement 7: Tasks API

**User Story:** As an Employee, I want to access task data through the API, so that the dashboard can display and manage internal tasks.

#### Acceptance Criteria

1. THE API SHALL expose a `GET /tasks` endpoint that returns a list of tasks assigned to the authenticated Employee.
2. THE API SHALL expose a `POST /tasks` endpoint that allows an Employee to create a new task with a title, status, and assignedTo field.
3. IF an unauthenticated request is made to any `/tasks` endpoint, THEN THE API SHALL return a 401 Unauthorized response.
4. IF a non-Employee User attempts to access the `/tasks` endpoints, THEN THE API SHALL return a 403 Forbidden response.

---

### Requirement 8: Lawyer Dashboard

**User Story:** As a Lawyer, I want a dedicated dashboard, so that I can manage my cases and clients.

#### Acceptance Criteria

1. THE Frontend SHALL render the Lawyer Dashboard at the `/dashboard/lawyer` route, accessible only to Users with the `lawyer` role.
2. THE Lawyer Dashboard SHALL fetch and display a summary of active cases from `GET /cases`.
3. THE Lawyer Dashboard SHALL display a list of the Lawyer's clients derived from case data.
4. THE Lawyer Dashboard SHALL provide navigation links to case detail and client detail views (placeholders acceptable for initial implementation).

---

### Requirement 9: Client Dashboard

**User Story:** As a Client, I want a dedicated dashboard, so that I can track the status of my cases.

#### Acceptance Criteria

1. THE Frontend SHALL render the Client Dashboard at the `/dashboard/client` route, accessible only to Users with the `client` role.
2. THE Client Dashboard SHALL fetch and display a summary of the Client's active cases and their current status from `GET /cases`.
3. THE Client Dashboard SHALL display upcoming deadlines relevant to the Client.
4. THE Client Dashboard SHALL provide a placeholder for messaging the assigned Lawyer.

---

### Requirement 10: Employee Dashboard

**User Story:** As an Employee, I want a dedicated dashboard, so that I can manage internal operations.

#### Acceptance Criteria

1. THE Frontend SHALL render the Employee Dashboard at the `/dashboard/employee` route, accessible only to Users with the `employee` role.
2. THE Employee Dashboard SHALL fetch and display a list of pending tasks from `GET /tasks`.
3. THE Employee Dashboard SHALL display a summary of recent firm activity.
4. THE Employee Dashboard SHALL provide navigation links to task management and reporting views (placeholders acceptable for initial implementation).

---

### Requirement 11: Responsive Design

**User Story:** As a User or Visitor, I want the app to be usable on mobile and desktop devices, so that I can access it from any device.

#### Acceptance Criteria

1. THE Frontend SHALL render all public pages and dashboards with a responsive layout that adapts to screen widths from 320px to 1920px.
2. THE Frontend SHALL render the navigation bar as a collapsible menu on screen widths below 768px.

---

### Requirement 12: Non-Functional Requirements

**User Story:** As a system operator, I want the app to meet baseline performance, security, and accessibility standards.

#### Acceptance Criteria

1. THE Frontend SHALL load all pages within 2 seconds under normal network conditions.
2. THE API SHALL respond to all requests within 500ms under normal load.
3. THE Auth_System SHALL hash all passwords using bcrypt before storing them.
4. THE Auth_System SHALL use JWT tokens for authentication between the Frontend and API.
5. THE Frontend SHALL include proper ARIA labels and support keyboard navigation on all interactive elements.
6. THE API SHALL log all requests, errors, and authentication events to standard output for monitoring and debugging.
7. THE API SHALL implement rate limiting on authentication endpoints (`/auth/signup`, `/auth/login`, `/auth/refresh`) to prevent brute-force attacks.
8. THE API SHALL enforce a CORS policy that allows requests only from trusted frontend origins defined in environment configuration.
9. THE System SHALL use environment variables for all sensitive configuration including JWT secrets, API keys, and allowed origins.

---

### Requirement 13: Health Check

**User Story:** As a system operator, I want a health check endpoint, so that I can verify the API is running correctly.

#### Acceptance Criteria

1. THE API SHALL expose a `GET /health` endpoint that returns a 200 response with a status indicator when the service is running.
2. THE `GET /health` endpoint SHALL NOT require authentication.
