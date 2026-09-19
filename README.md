# Task Management Backend API

A role-based Task Management System built with **Node.js**, **Express.js**, and **MongoDB**. This backend provides authentication, user management, feature management, task management, and test case management with JWT-based authorization.

---

## Tech Stack

- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **JWT** Authentication
- **bcryptjs** for password hashing
- **Winston** for application logging
- **dotenv** for environment configuration

---

## Project Structure

```text
task-management-backend/
├── config/
│   └── db.js
├── controllers/
├── middleware/
├── models/
├── routes/
├── seed/
│   └── admin.js
├── utils/
│   └── logger.js
├── logs/
├── .env
├── .gitignore
├── package.json
└── server.js
```

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd task-management-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Install MongoDB (Local)

Make sure MongoDB is installed and running on your machine.

Start MongoDB:

```bash
sudo systemctl start mongod
```

Verify:

```bash
mongosh
```

### 4. Create the `.env` file

Create a `.env` file in the project root.

```env
PORT=5000

MONGO_URI=mongodb://127.0.0.1:27017/task_management

JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=1h

ADMIN_USERNAME=admin
ADMIN_NAME=Administrator
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin@123
```

### 5. Seed the Administrator account

Run the seed script once.

```bash
npm run seed:admin
```

This creates the default Administrator account if it doesn't already exist.

---

## How to Run the Application

### Development Mode

```bash
npm run dev
```

The server starts at:

```text
http://localhost:5000
```

### Production Mode

```bash
npm start
```

---

## Default Roles

The system supports the following user roles.

| Role          | Description                                               |
| ------------- | --------------------------------------------------------- |
| **admin**     | Manages users and system administration.                  |
| **team_lead** | Creates features and assigns tasks to developers/testers. |
| **developer** | Creates tasks for themselves and works on assigned tasks. |
| **tester**    | Creates test cases and works on assigned testing tasks.   |
| **reader**    | Read-only access to project information.                  |

---

## Seeded Administrator Credentials

These credentials are created by the seed script.

| Field    | Value               |
| -------- | ------------------- |
| Username | `admin`             |
| Email    | `admin@example.com` |
| Password | `Admin@123`         |
| Role     | `admin`             |

> Change the default administrator password before using this application in production.

---

## API Endpoints

### Authentication

| Method | Endpoint          | Access |
| ------ | ----------------- | ------ |
| POST   | `/api/auth/login` | Public |

### Admin

| Method | Endpoint           | Access     |
| ------ | ------------------ | ---------- |
| POST   | `/api/admin/users` | Admin Only |

Creates users with roles:

- `team_lead`
- `developer`
- `tester`
- `reader`

### Features

| Method | Endpoint        | Access         |
| ------ | --------------- | -------------- |
| POST   | `/api/features` | Team Lead Only |

A Feature contains:

- Title
- Content
- Comments
- Created By

### Tasks

| Method | Endpoint     | Access                       |
| ------ | ------------ | ---------------------------- |
| POST   | `/api/tasks` | Team Lead, Developer, Tester |

Task fields:

- Title
- Content
- Comments
- Created By
- Assigned To
- Feature
- Status

Task Status Values:

- `New`
- `Active`
- `QA`
- `Closed`

Task Rules:

- Team Lead creates tasks for a Feature and assigns them to a Developer or Tester.
- Developer-created tasks are automatically assigned to the Developer.
- Tester-created tasks are automatically assigned to the Tester.

### Test Cases

| Method | Endpoint          | Access                              |
| ------ | ----------------- | ----------------------------------- |
| POST   | `/api/test-cases` | Tester Only                         |
| GET    | `/api/test-cases` | All Authenticated Users _(planned)_ |

Test Case fields:

- Feature
- Title
- Steps
- Created By
- Assigned To

Rules:

- Only Testers can create test cases.
- Every authenticated user can view test cases.

---

## Authentication

Login returns a JWT access token.

Include the token in protected requests.

```http
Authorization: Bearer <JWT_TOKEN>
```

---

## Sample Login Request

**POST** `/api/auth/login`

```json
{
  "username": "admin",
  "password": "Admin@123"
}
```

Successful response:

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

## Logging

Application logging is handled using **Winston**.

Logs include:

- Application startup.
- Authentication events.
- User creation events.
- Feature, Task, and Test Case creation.
- Errors and exceptions.

---

## Current Features

- JWT Authentication
- Role-Based Authorization
- Administrator Seeder
- User Management
- Feature Management
- Task Management
- Test Case Management
- Winston Logging
