# Slice 'n Spice 🍕🌶️

Slice 'n Spice is a modern, premium full-stack restaurant management platform and administrative dashboard. It provides restaurateurs with a responsive CRUD interface to configure categories, menu items, culinary chefs, and daily specials, paired with an elegant, immersive customer-facing landing page.

---

## 🚀 Key Features

*   **Google OAuth 2.0 Integration**: Secure user signin powered by Passport.js and Google APIs.
*   **Session Persistence ("Remember Me")**: A custom-built switch toggle on login:
    *   **Toggled On**: Extends session lifetime to **30 Days**.
    *   **Toggled Off**: Defaults session lifetime to **7 Days**.
*   **Role-Based Access Control (RBAC)**:
    *   **Admins** gain full access to the database CRUD operations.
    *   **Standard Users** are safely authenticated but blocked from accessing admin routes with custom React-Toastify warnings.
*   **Centralized Global Search**: Debounced database search query endpoint across Categories, Menu Items, Chefs, and Specials.
*   **Scattered Scrapbook Specials Collage**: A responsive landing page with rotating chef profiles and scattered collage sections.
*   **TypeScript & Form Validation**: End-to-end type safety with robust form schema checks via `react-hook-form` and `yup`.

---

## 🛠️ Tech Stack

### Client (Frontend)
*   **Core**: React 19, Vite 8, TypeScript
*   **Styling**: Tailwind CSS
*   **Forms**: React Hook Form, Yup Validation
*   **Notifications**: React Toastify
*   **Icons**: Lucide React

### Server (Backend)
*   **Core**: Node.js, Express, TypeScript
*   **Database**: MongoDB, Mongoose ORM
*   **Auth & Session**: Passport.js (Google OAuth), express-session
*   **State Store**: Redis (optional fallback session store)

---

## 📂 Project Structure

```
Slice'n_Spice/
├── client/          # React + Vite frontend application
│   ├── src/
│   │   ├── components/  # Reusable UI inputs & guards
│   │   ├── context/     # Auth Context provider
│   │   ├── pages/       # Landing and Admin Login/Dashboard
│   │   └── main.tsx
│   └── package.json
├── server/          # Node.js + Express backend server
│   ├── src/
│   │   ├── config/      # DB connection setups
│   │   ├── models/      # Mongoose schemas (Category, Item, Chef, Special, User)
│   │   ├── modules/     # API controllers, routes, and validation schemas
│   │   └── server.ts
│   └── package.json
└── .gitignore       # Root git ignore (excludes credentials and node_modules)
```

---

## ⚙️ Installation & Configuration

### Prerequisites
*   Node.js (v18+)
*   MongoDB Instance (Atlas or Local)
*   Google Developer Console account (for Google Client ID & Secret)

### Step 1: Clone the Repository
```bash
git clone https://github.com/Umang-J-S/Slice-n-Spice.git
cd Slice-n-Spice
```

### Step 2: Configure Server env
Create a `.env` file in the `/server` directory with the following variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_custom_session_secret

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback

# Client Redirect URIs
CLIENT_ORIGIN=http://localhost:5173
CLIENT_REDIRECT_URL=http://localhost:5173/

# Access Control
ADMIN_EMAILS=admin@example.com,your_admin_email@gmail.com
ALLOWED_ROLES=admin,user
```

### Step 3: Install Dependencies
Run `npm install` inside both individual workspace directories:

```bash
# Install Server dependencies
cd server
npm install

# Install Client dependencies
cd ../client
npm install
```

### Step 4: Run the Application (Locally)

**Start the Server:**
```bash
cd server
npm run dev
```

**Start the Client:**
```bash
cd client
npm run dev
```

Visit the website at `http://localhost:5173/` and navigate to the admin portal at `/admin/login` to sign in.
