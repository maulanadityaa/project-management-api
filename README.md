# Project Management API 🎯

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-blue?style=flat-square" alt="TypeScript Badge" />
  <img src="https://img.shields.io/badge/Node.js-green?style=flat-square&logo=node.js&logoColor=white" alt="Node.js Badge" />
  <img src="https://img.shields.io/badge/NestJS-red?style=flat-square&logo=nestjs&logoColor=white" alt="NestJS Badge" />
  <img src="https://img.shields.io/badge/Prisma-blueviolet?style=flat-square&logo=prisma&logoColor=white" alt="Prisma Badge" />
  <!-- <img src="https://img.shields.io/badge/Supabase-brightgreen?style=flat-square&logo=supabase&logoColor=white" alt="Supabase Badge" /> -->
</p>

A robust and scalable RESTful API built using **TypeScript**, **Node.js**, and **NestJS** for managing projects, tasks, and user roles. Designed with modern best practices, this API provides a flexible backend foundation for project management applications.

---

## 📚 Table of Contents

- [Project Management API 🎯](#project-management-api-)
  - [📚 Table of Contents](#-table-of-contents)
  - [✨ Key Features](#-key-features)
  - [🛠️ Tech Stack](#️-tech-stack)
  - [🚀 Getting Started](#-getting-started)
  - [⚙️ Environment Variables](#️-environment-variables)
  - [📦 API Endpoints](#-api-endpoints)
  - [📨 Sample Requests \& Responses](#-sample-requests--responses)
    - [✅ Register](#-register)
    - [🔐 Login](#-login)
    - [📁 Create Project](#-create-project)
  - [🤝 Contribution Guide](#-contribution-guide)

---

## ✨ Key Features

- 🔐 **Authentication & Authorization**  
  Secure endpoints using JWT. Only authorized users can access protected resources.

- 🗂️ **Task Management**  
  Create, assign, and track tasks with status and priority control.

- 💾 **Database Integration with Prisma**  
  Leverage Prisma for database access and type-safe queries.

- 📚 **API Documentation**  
  Full Swagger documentation available at:  
  👉 **[Live Swagger Docs](https://project-management-api-cyan.vercel.app/api/v1/docs)**

---

## 🛠️ Tech Stack

| Tech       | Description                         |
| ---------- | ----------------------------------- |
| TypeScript | Typed superset of JavaScript        |
| NestJS     | Scalable Node.js framework          |
| Prisma     | Next-gen ORM for TypeScript/Node.js |
| Supabase   | Optional DB                         |
| PostgreSQL | Primary database                    |
| Swagger    | API documentation                   |

---

## 🚀 Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/maulanadityaa/project-management-api

# 2. Enter the project directory
cd project-management-api

# 3. Install dependencies
npm install

# 4. Copy the example environment file
cp .env.example .env

# 5. Run the app in development mode
npm run start:dev
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory with the following structure:

```env
# Application
PORT=3000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1d

# Database (PostgreSQL)
DATABASE_URL=postgresql://user:password@localhost:5432/project_management_db

# Supabase
SUPABASE_URL=https://your-supabase-url.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Swagger
SWAGGER_API_TITLE=Project Management API
SWAGGER_API_DESCRIPTION=REST API documentation for managing projects and tasks
SWAGGER_API_VERSION=1.0
```

Update values as needed to match your local or production environment.

---

## 📦 API Endpoints

| Method | Endpoint                   | Description          |
| ------ | -------------------------- | -------------------- |
| POST   | `/api/v1/auth/login`       | Login user           |
| POST   | `/api/v1/auth/register`    | Register new user    |
| GET    | `/api/v1/projects`         | List all projects    |
| POST   | `/api/v1/projects`         | Create a new project |
| GET    | `/api/v1/projects/:id`     | Get project details  |
| PUT    | `/api/v1/projects/:id`     | Update project       |
| DELETE | `/api/v1/projects/:id`     | Delete project       |
| GET    | `/api/v1/tasks`            | List tasks           |
| POST   | `/api/v1/tasks`            | Create task          |
| PUT    | `/api/v1/tasks/:id/status` | Update task status   |

---

## 📨 Sample Requests & Responses

### ✅ Register

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "johndoe@example.com",
  "password": "secure123"
}
```

**Response:**

```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "email": "johndoe@example.com"
  }
}
```

---

### 🔐 Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "johndoe@example.com",
  "password": "secure123"
}
```

**Response:**

```json
{
  "token": "jwt.token.here"
}
```

---

### 📁 Create Project

```http
POST /projects
Authorization: Bearer jwt.token.here
Content-Type: application/json

{
  "name": "New Feature Development",
  "description": "Work on new payment integration feature"
}
```

**Response:**

```json
{
  "id": "project-uuid",
  "name": "New Feature Development",
  "description": "Work on new payment integration feature",
  "createdAt": "2025-06-11T12:00:00.000Z"
}
```

---

## 🤝 Contribution Guide

1. **Fork** the repo
2. **Create a new branch**
   ```bash
   git checkout -b feature/your-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add feature'
   ```
4. **Push your branch**
   ```bash
   git push origin feature/your-feature
   ```
5. **Submit a Pull Request**

We welcome contributions! Please ensure your code adheres to the project's coding standards and includes tests where applicable.
