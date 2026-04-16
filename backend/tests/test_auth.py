import pytest
from fastapi.testclient import TestClient
from backend.main import app
from backend.store.users import users_db
from backend.store.cases import cases_db
from backend.store.tasks import tasks_db
from backend.models.user import UserCreate

client = TestClient(app)


@pytest.fixture(autouse=True)
def clear_dbs():
    """Clear all databases before each test."""
    users_db.clear()
    cases_db.clear()
    tasks_db.clear()
    yield
    users_db.clear()
    cases_db.clear()
    tasks_db.clear()


class TestSignup:
    """Tests for POST /auth/signup endpoint."""
    
    def test_successful_signup(self):
        """Test successful user signup returns tokens and user info."""
        response = client.post(
            "/auth/signup",
            json={
                "name": "John Lawyer",
                "email": "john@example.com",
                "password": "SecurePass123!",
                "role": "lawyer",
            },
        )
        
        assert response.status_code == 201
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["token_type"] == "bearer"
        assert data["user"]["email"] == "john@example.com"
        assert data["user"]["role"] == "lawyer"
        assert data["user"]["name"] == "John Lawyer"
    
    def test_signup_duplicate_email(self):
        """Test signup with duplicate email returns 409 Conflict."""
        # Create first user
        client.post(
            "/auth/signup",
            json={
                "name": "John Lawyer",
                "email": "john@example.com",
                "password": "SecurePass123!",
                "role": "lawyer",
            },
        )
        
        # Try to create another user with same email
        response = client.post(
            "/auth/signup",
            json={
                "name": "Jane Lawyer",
                "email": "john@example.com",
                "password": "AnotherPass456!",
                "role": "lawyer",
            },
        )
        
        assert response.status_code == 409
        assert "already registered" in response.json()["detail"]
    
    def test_signup_invalid_email(self):
        """Test signup with invalid email format returns 422."""
        response = client.post(
            "/auth/signup",
            json={
                "name": "John Lawyer",
                "email": "invalid-email",
                "password": "SecurePass123!",
                "role": "lawyer",
            },
        )
        
        assert response.status_code == 422
    
    def test_signup_short_password(self):
        """Test signup with password < 8 chars returns 422."""
        response = client.post(
            "/auth/signup",
            json={
                "name": "John Lawyer",
                "email": "john@example.com",
                "password": "Short1!",
                "role": "lawyer",
            },
        )
        
        assert response.status_code == 422
    
    def test_signup_short_name(self):
        """Test signup with name < 2 chars returns 422."""
        response = client.post(
            "/auth/signup",
            json={
                "name": "J",
                "email": "john@example.com",
                "password": "SecurePass123!",
                "role": "lawyer",
            },
        )
        
        assert response.status_code == 422


class TestLogin:
    """Tests for POST /auth/login endpoint."""
    
    def test_successful_login(self):
        """Test successful login returns tokens and user info."""
        # Create a user first
        client.post(
            "/auth/signup",
            json={
                "name": "John Lawyer",
                "email": "john@example.com",
                "password": "SecurePass123!",
                "role": "lawyer",
            },
        )
        
        # Login with correct credentials
        response = client.post(
            "/auth/login",
            json={
                "email": "john@example.com",
                "password": "SecurePass123!",
                "role": "lawyer",
            },
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["user"]["email"] == "john@example.com"
    
    def test_login_wrong_password(self):
        """Test login with wrong password returns 401."""
        # Create a user first
        client.post(
            "/auth/signup",
            json={
                "name": "John Lawyer",
                "email": "john@example.com",
                "password": "SecurePass123!",
                "role": "lawyer",
            },
        )
        
        # Try to login with wrong password
        response = client.post(
            "/auth/login",
            json={
                "email": "john@example.com",
                "password": "WrongPassword!",
                "role": "lawyer",
            },
        )
        
        assert response.status_code == 401
        assert "Invalid email or password" in response.json()["detail"]
    
    def test_login_nonexistent_email(self):
        """Test login with non-existent email returns 401."""
        response = client.post(
            "/auth/login",
            json={
                "email": "nonexistent@example.com",
                "password": "SomePassword123!",
                "role": "lawyer",
            },
        )
        
        assert response.status_code == 401
        assert "Invalid email or password" in response.json()["detail"]


class TestRefresh:
    """Tests for POST /auth/refresh endpoint."""
    
    def test_successful_refresh(self):
        """Test successful token refresh returns new tokens."""
        # Create a user and get tokens
        signup_response = client.post(
            "/auth/signup",
            json={
                "name": "John Lawyer",
                "email": "john@example.com",
                "password": "SecurePass123!",
                "role": "lawyer",
            },
        )
        
        refresh_token = signup_response.json()["refresh_token"]
        
        # Refresh the token
        response = client.post(
            "/auth/refresh",
            json={"refresh_token": refresh_token},
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["user"]["email"] == "john@example.com"
    
    def test_refresh_invalid_token(self):
        """Test refresh with invalid token returns 401."""
        response = client.post(
            "/auth/refresh",
            json={"refresh_token": "invalid.token.here"},
        )
        
        assert response.status_code == 401
        assert "Invalid or expired refresh token" in response.json()["detail"]


class TestLogout:
    """Tests for POST /auth/logout endpoint."""
    
    def test_successful_logout(self):
        """Test successful logout returns 200."""
        # Create a user and get tokens
        signup_response = client.post(
            "/auth/signup",
            json={
                "name": "John Lawyer",
                "email": "john@example.com",
                "password": "SecurePass123!",
                "role": "lawyer",
            },
        )
        
        access_token = signup_response.json()["access_token"]
        
        # Logout
        response = client.post(
            "/auth/logout",
            headers={"Authorization": f"Bearer {access_token}"},
        )
        
        assert response.status_code == 200
        assert "Logged out successfully" in response.json()["message"]
    
    def test_logout_without_token(self):
        """Test logout without token returns 401."""
        response = client.post("/auth/logout")
        
        assert response.status_code == 401



# Test fixtures for cases and tasks
@pytest.fixture
def lawyer_token():
    """Create a lawyer user and return their access token."""
    response = client.post(
        "/auth/signup",
        json={
            "name": "John Lawyer",
            "email": "lawyer@example.com",
            "password": "SecurePass123!",
            "role": "lawyer",
        },
    )
    return response.json()["access_token"]


@pytest.fixture
def client_token():
    """Create a client user and return their access token."""
    response = client.post(
        "/auth/signup",
        json={
            "name": "Jane Client",
            "email": "client@example.com",
            "password": "SecurePass123!",
            "role": "client",
        },
    )
    return response.json()["access_token"]


@pytest.fixture
def employee_token():
    """Create an employee user and return their access token."""
    response = client.post(
        "/auth/signup",
        json={
            "name": "Bob Employee",
            "email": "employee@example.com",
            "password": "SecurePass123!",
            "role": "employee",
        },
    )
    return response.json()["access_token"]


class TestCases:
    """Tests for /cases endpoints."""
    
    def test_lawyer_create_case(self, lawyer_token):
        """Test lawyer can create a case."""
        response = client.post(
            "/cases",
            json={
                "title": "Smith vs. Jones",
                "status": "open",
                "client_id": "client123",
            },
            headers={"Authorization": f"Bearer {lawyer_token}"},
        )
        
        assert response.status_code == 201
        data = response.json()
        assert data["title"] == "Smith vs. Jones"
        assert data["status"] == "open"
        assert "id" in data
    
    def test_non_lawyer_cannot_create_case(self, client_token):
        """Test non-lawyer cannot create a case."""
        response = client.post(
            "/cases",
            json={
                "title": "Smith vs. Jones",
                "status": "open",
                "client_id": "client123",
            },
            headers={"Authorization": f"Bearer {client_token}"},
        )
        
        assert response.status_code == 403
        assert "Only lawyers can create cases" in response.json()["detail"]
    
    def test_lawyer_sees_own_cases(self, lawyer_token):
        """Test lawyer sees only their own cases."""
        # Create a case
        create_response = client.post(
            "/cases",
            json={
                "title": "Smith vs. Jones",
                "status": "open",
                "client_id": "client123",
            },
            headers={"Authorization": f"Bearer {lawyer_token}"},
        )
        
        # List cases
        response = client.get(
            "/cases",
            headers={"Authorization": f"Bearer {lawyer_token}"},
        )
        
        assert response.status_code == 200
        cases = response.json()
        assert len(cases) == 1
        assert cases[0]["title"] == "Smith vs. Jones"
    
    def test_client_sees_own_cases(self, client_token, lawyer_token):
        """Test client sees only their own cases."""
        # Get client ID from token
        import json
        import base64
        
        # Decode JWT to get client ID (this is a simplified approach for testing)
        # In real scenario, we'd need to track the user ID
        
        # Create a case as lawyer for this client
        response = client.post(
            "/cases",
            json={
                "title": "Smith vs. Jones",
                "status": "open",
                "client_id": "client123",
            },
            headers={"Authorization": f"Bearer {lawyer_token}"},
        )
        
        # Client should not see cases not assigned to them
        response = client.get(
            "/cases",
            headers={"Authorization": f"Bearer {client_token}"},
        )
        
        assert response.status_code == 200
        cases = response.json()
        # Client should see 0 cases since they're not assigned to any
        assert len(cases) == 0


class TestTasks:
    """Tests for /tasks endpoints."""
    
    def test_employee_create_task(self, employee_token):
        """Test employee can create a task."""
        response = client.post(
            "/tasks",
            json={
                "title": "Review documents",
                "status": "pending",
                "assigned_to": "emp123",
            },
            headers={"Authorization": f"Bearer {employee_token}"},
        )
        
        assert response.status_code == 201
        data = response.json()
        assert data["title"] == "Review documents"
        assert data["status"] == "pending"
        assert "id" in data
    
    def test_non_employee_cannot_create_task(self, lawyer_token):
        """Test non-employee cannot create a task."""
        response = client.post(
            "/tasks",
            json={
                "title": "Review documents",
                "status": "pending",
                "assigned_to": "emp123",
            },
            headers={"Authorization": f"Bearer {lawyer_token}"},
        )
        
        assert response.status_code == 403
        assert "Only employees can create tasks" in response.json()["detail"]
    
    def test_non_employee_cannot_list_tasks(self, lawyer_token):
        """Test non-employee cannot list tasks."""
        response = client.get(
            "/tasks",
            headers={"Authorization": f"Bearer {lawyer_token}"},
        )
        
        assert response.status_code == 403
        assert "Only employees can access tasks" in response.json()["detail"]
