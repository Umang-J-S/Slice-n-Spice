# API Documentation

All routes are now prefixed with `/api/v1`.

## Users API

### 1. Get All Users
- **Method:** `GET`
- **Route:** `/api/v1/users`
- **Description:** Get a list of all users.
- **Access:** Public
- **Payload/Data:** None

## Auth API

### 1. Initiate Google OAuth
- **Method:** `GET`
- **Route:** `/api/v1/auth/google`
- **Description:** Initiates the Google OAuth login flow. Redirects the user to Google's login page.
- **Access:** Public
- **Payload/Data:** None

### 2. Google OAuth Callback
- **Method:** `GET`
- **Route:** `/api/v1/auth/google/callback`
- **Description:** Callback URL for Google OAuth. Google redirects here after successful login.
- **Access:** Public
- **Payload/Data:** Query parameters (handled automatically by Passport.js, e.g., `?code=...`)

### 3. Logout User
- **Method:** `GET`
- **Route:** `/api/v1/auth/logout`
- **Description:** Logs out the currently authenticated user and clears their session.
- **Access:** Private
- **Payload/Data:** None

### 4. Get Current User
- **Method:** `GET`
- **Route:** `/api/v1/auth/current-user`
- **Description:** Returns the data of the currently logged-in user.
- **Access:** Private
- **Payload/Data:** None

## Admin API

### 1. Get Dashboard Statistics
- **Method:** `GET`
- **Route:** `/api/v1/admin/dashboard`
- **Description:** Retrieves statistics and information for the admin dashboard.
- **Access:** Private (Requires Authentication and Admin Role)
- **Payload/Data:** None
