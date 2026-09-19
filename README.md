# Task Management Backend API

A role-based **Task Management System** REST API built with **Node.js**, **Express 5**, and **MongoDB**. It provides JWT authentication, admin-controlled user management, and creation of features, tasks, and test cases with role-based authorization.

---

## Tech Stack

- **Node.js** + **Express 5**
- **MongoDB** + **Mongoose**
- **Passport** (`passport-jwt`) + **JWT** for authentication
- **bcryptjs** for password hashing
- **Winston** for application logging
- **dotenv** for environment configuration
- **ESLint** + **Prettier** + **Husky** + **lint-staged** for code quality

---

## Features

- JWT authentication (login → bearer token)
- Role-based authorization middleware
- Administrator account seeding (admins cannot self-register)
- Admin-only user creation with role assignment at creation time
- Feature creation (team leads)
- Task creation (team leads, developers)
- Test case creation (testers)
- Structured application logging

---

## Project Structure

```text
task-management-backend/
├── config/
│   ├── db.js              # MongoDB connection
│   └── passport.js        # passport-jwt strategy
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── featureController.js
│   ├── taskController.js
│   └── testCaseController.js
├── middleware/
│   ├── authMiddleware.js  # JWT authentication
│   └── roleMiddleware.js  # role-based authorization
├── models/
│   ├── User.js
│   ├── Feature.js
│   ├── Task.js
│   └── TestCase.js
├── routes/
│   ├── authRoutes.js
│   ├── adminRoutes.js
│   ├── featureRoutes.js
│   ├── taskRoutes.js
│   └── testCaseRoutes.js
├── seed/
│   └── admin.js           # seeds the administrator account
├── utils/
│   └── logger.js          # Winston logger
├── eslint.config.js
├── .env                   # not committed
├── package.json
└── server.js              # app entry point
```

---

## Prerequisites

- **Node.js** 18+ (Express 5 requires a modern Node runtime)
- **MongoDB** running locally or a connection string to a hosted instance

---

## Setup

### 1. Clone and install

```bash
git clone <repository-url>
cd task-management-backend
npm install
```

### 2. Start MongoDB

Make sure MongoDB is running locally (or have a hosted URI ready):

```bash
sudo systemctl start mongod   # Linux example
mongosh                       # verify you can connect
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
PORT=5000

MONGO_URI=mongodb://127.0.0.1:27017/task_management

JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=1h

ADMIN_USERNAME=admin
ADMIN_NAME=Administrator
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin@123
```

> Use a strong, random `JWT_SECRET` and change the default admin password before any real deployment.

### 4. Seed the administrator account

Administrator accounts can **only** be created through seeding. Run once:

```bash
node seed/admin.js
```

This creates the admin defined in your `.env` if one does not already exist.

> Tip: add `"seed:admin": "node seed/admin.js"` to the `scripts` block in `package.json` so you can run `npm run seed:admin`.

---

## Running the Application

```bash
npm run dev     # development (nodemon, auto-restart)
npm start       # production
```

The server starts at `http://localhost:5000` (or your `PORT`).

---

## NPM Scripts

| Script                 | Description                      |
| ---------------------- | -------------------------------- |
| `npm start`            | Run the server                   |
| `npm run dev`          | Run with nodemon (auto-restart)  |
| `npm run lint`         | Lint the codebase                |
| `npm run lint:fix`     | Lint and auto-fix                |
| `npm run format`       | Format with Prettier             |
| `npm run format:check` | Check formatting without writing |

---

## Roles

| Role          | Description                                          |
| ------------- | ---------------------------------------------------- |
| **admin**     | Manages users; seeded only. Cannot modify the board. |
| **team_lead** | Creates features; creates and assigns tasks.         |
| **developer** | Creates tasks (auto-assigned to themselves).         |
| **tester**    | Creates test cases (auto-assigned to themselves).    |
| **reader**    | Intended for read-only visibility (see Roadmap).     |

---

## Seeded Administrator Credentials

Created by the seed script from your `.env` values. Defaults:

| Field    | Value               |
| -------- | ------------------- |
| Username | `admin`             |
| Email    | `admin@example.com` |
| Password | `Admin@123`         |
| Role     | `admin`             |

---

## API Endpoints

All protected endpoints require an `Authorization: Bearer <token>` header.

### Authentication

| Method | Endpoint          | Access | Body                     |
| ------ | ----------------- | ------ | ------------------------ |
| POST   | `/api/auth/login` | Public | `{ username, password }` |

### Admin — User Management

| Method | Endpoint           | Access | Body                                        |
| ------ | ------------------ | ------ | ------------------------------------------- |
| POST   | `/api/admin/users` | Admin  | `{ username, name, email, password, role }` |

Assignable roles: `team_lead`, `developer`, `tester`, `reader`.

### Features

| Method | Endpoint        | Access    | Body                 |
| ------ | --------------- | --------- | -------------------- |
| POST   | `/api/features` | Team Lead | `{ title, content }` |

### Tasks

| Method | Endpoint     | Access               | Body                                       |
| ------ | ------------ | -------------------- | ------------------------------------------ |
| POST   | `/api/tasks` | Team Lead, Developer | `{ title, content, feature, assignedTo? }` |

- **Team lead:** must provide `assignedTo` (a developer or tester).
- **Developer:** task is automatically assigned to themselves; `assignedTo` is ignored.
- The referenced `feature` must exist.
- New tasks start with status `New`. Valid statuses: `New`, `Active`, `QA`, `Closed`.

### Test Cases

| Method | Endpoint          | Access | Body                        |
| ------ | ----------------- | ------ | --------------------------- |
| POST   | `/api/test-cases` | Tester | `{ feature, title, steps }` |

- `steps` must be a non-empty array.
- The referenced `feature` must exist.
- Test cases are auto-assigned to the creating tester.

---

## Authentication Flow

1. `POST /api/auth/login` with valid credentials.
2. Receive a JWT in the response.
3. Send it on protected requests:

```http
Authorization: Bearer <JWT_TOKEN>
```

### Sample login

**Request** — `POST /api/auth/login`

```json
{
  "username": "admin",
  "password": "Admin@123"
}
```

**Response**

```json
{
  "message": "Login successful",
  "token": "<JWT_TOKEN>",
  "user": {
    "id": "...",
    "username": "admin",
    "name": "Administrator",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

---

## Data Model

| Entity       | Fields                                                                         |
| ------------ | ------------------------------------------------------------------------------ |
| **User**     | username, name, email, password (hashed), role, timestamps                     |
| **Feature**  | title, content, comments[], createdBy, timestamps                              |
| **Task**     | title, content, comments[], createdBy, assignedTo, feature, status, timestamps |
| **TestCase** | feature, title, steps[], createdBy, assignedTo, timestamps                     |

---

## Logging

Application logging uses **Winston** and currently records startup, authentication, user/feature/task/test-case creation, and errors. See the [Roadmap](#roadmap) for planned logging changes.

---

## License

ISC
