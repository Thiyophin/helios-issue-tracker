# Helios Issue Tracker

A role-based **Task Management System** REST API built with **Node.js**, **Express 5**, and **MongoDB**. It provides JWT authentication, admin-controlled user management, and creation of features, tasks, and test cases with role-based authorization.

---

## Tech Stack

- **Node.js** + **Express 5**
- **MongoDB** + **Mongoose**
- **Passport** (`passport-jwt`) + **JWT** for authentication
- **bcryptjs** for password hashing
- **Winston** for application logging
- **Swagger / OpenAPI** for API documentation
- **dotenv** + **envalid** for environment configuration
- **ESLint** + **Prettier** + **Husky** + **lint-staged** for code quality
- **Docker** + **Docker Compose** for containerized development

---

## Features

- JWT authentication
- Role-based authorization middleware
- Administrator account seeding
- Admin-only user creation with role assignment
- Feature creation
- Task creation and assignment
- Test case creation
- Structured application logging
- Centralized error handling
- Request rate limiting
- Security headers with Helmet
- Interactive OpenAPI / Swagger API documentation
- Dockerized MongoDB and API environment

---

## Prerequisites

- **Node.js 18+**
- **Docker**
- **Docker Compose**

The project uses Docker for MongoDB and API development.

---

## Setup

### 1. Clone and install

```bash
git clone <repository-url>

cd helios-issue-tracker

npm install
```
