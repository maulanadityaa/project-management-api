<h1 align="center">Project Management API 🎯</h1>

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-blue?style=flat-square" />
  <img src="https://img.shields.io/badge/NestJS-red?style=flat-square&logo=nestjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Prisma-blueviolet?style=flat-square&logo=prisma&logoColor=white" />
  <img src="https://img.shields.io/badge/Zod-3.23.8-yellow?style=flat-square" />
</p>

<p align="center">
  A secure and production-ready RESTful API built with <b>NestJS</b>, <b>Prisma</b>, and <b>TypeScript</b>. This project handles project portfolios, user authentication with email confirmation, password recovery, and technology tagging—complete with Cloudinary for image uploads and Swagger documentation.
</p>

---

## ✨ Features

- ✅ JWT Authentication & Refresh Tokens
- ✉️ Email Confirmation (via Mailer & Pug Templates)
- 🔑 Forgot / Reset Password with Token Verification
- 📁 Project CRUD with image upload (Cloudinary)
- 🏷️ Technology tagging with reusable endpoints
- 📦 Swagger/OpenAPI 3.0 compliant docs
- 🎯 Built with Zod, Winston logger, Axios, and more

---

## 🛠️ Tech Stack

| Tech       | Role                |
| ---------- | ------------------- |
| NestJS     | Server Framework    |
| TypeScript | Language            |
| Prisma     | ORM for PostgreSQL  |
| PostgreSQL | Relational Database |
| Zod        | Schema Validation   |
| Cloudinary | Image Uploads       |
| Nodemailer | Email Service       |
| Pug        | Email Templating    |
| Winston    | Logging             |
| Swagger UI | API Documentation   |

---

## 🚀 Getting Started

```bash
git clone https://github.com/maulanadityaa/project-management-api
cd project-management-api
npm install
cp .env.example .env
npm run start:dev
```

---

## ⚙️ Environment Variables

```env
# App
PORT=3030
NODE_ENV=development
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/yourdb

# Supabase (optional)
SUPABASE_URL=https://your-supabase.supabase.co
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# Cloudinary
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_secret

# Mailer
MAIL_USER=your_email@example.com
MAIL_PASS=your_password
MAIL_FROM_NAME=Project API
MAIL_FROM_EMAIL=your_email@example.com

# Swagger
SWAGGER_API_TITLE=Project Management API
SWAGGER_API_DESCRIPTION=API for managing projects
SWAGGER_API_VERSION=1.0
```

---

## 📦 API Overview (Examples)

### 🔐 Auth Routes

| Method | Endpoint                                    | Description                  |
| ------ | ------------------------------------------- | ---------------------------- |
| POST   | `/api/v1/auth/register`                     | Register a user              |
| POST   | `/api/v1/auth/login`                        | Login user                   |
| POST   | `/api/v1/auth/refresh-token`                | Refresh JWT token            |
| GET    | `/api/v1/auth/me`                           | Get current user             |
| GET    | `/api/v1/auth/confirm`                      | Confirm email registration   |
| POST   | `/api/v1/auth/send-confirmation-email`      | Resend email confirmation    |
| POST   | `/api/v1/auth/forgot-password`              | Request password reset email |
| POST   | `/api/v1/auth/confirm-token-reset-password` | Confirm reset token          |
| PUT    | `/api/v1/auth/update`                       | Update user profile/password |

### 📁 Project Routes

| Method | Endpoint                           | Description          |
| ------ | ---------------------------------- | -------------------- |
| POST   | `/api/v1/projects`                 | Create new project   |
| GET    | `/api/v1/projects`                 | List all projects    |
| GET    | `/api/v1/projects/search-per-user` | List user's projects |
| PUT    | `/api/v1/projects`                 | Update project       |
| DELETE | `/api/v1/projects/{id}`            | Soft delete project  |
| PATCH  | `/api/v1/projects/{id}/reactivate` | Reactivate project   |

### 🧪 Technology Routes

| Method | Endpoint                               | Description           |
| ------ | -------------------------------------- | --------------------- |
| POST   | `/api/v1/technologies`                 | Add a technology      |
| PUT    | `/api/v1/technologies`                 | Update a technology   |
| GET    | `/api/v1/technologies`                 | List all technologies |
| GET    | `/api/v1/technologies/{techId}`        | Get tech by ID        |
| GET    | `/api/v1/technologies/name/{techName}` | Get tech by name      |
| DELETE | `/api/v1/technologies/{techId}`        | Delete technology     |

---

## 🔍 Example

### 🔐 Register

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "name": "Test User",
  "password": "strongpass123"
}
```

**Response**

```json
{
  "token": "jwt.token.here",
  "isEmailSent": true
}
```

### 📁 Create Project

```http
POST /api/v1/projects
Authorization: Bearer jwt.token.here
Content-Type: multipart/form-data

Form Data:
  name: Team Dashboard
  description: A real-time dashboard for tracking team productivity
  link: https://team-dashboard.io
  technologies: ["React", "Node.js", "PostgreSQL"]
  image: (upload image file, e.g. dashboard.png)
```

**Response**

```json
{
  "id": "f5f2e998-8b9c-4a30-9a70-2bc30d38a7e7",
  "name": "Team Dashboard",
  "description": "A real-time dashboard for tracking team productivity",
  "link": "https://team-dashboard.io",
  "technologies": ["React", "Node.js", "PostgreSQL"],
  "imageUrl": "https://res.cloudinary.com/your-cloud/image/upload/v123456/dashboard.png",
  "userResponse": {
    "uid": "user-id",
    "username": "johndoe",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "createdAt": "2025-06-17T09:00:00.000Z",
  "updatedAt": "2025-06-17T09:00:00.000Z"
}
```

---

## 🌐 Swagger Documentation

Docs available at:  
📄 [`/api/v1/docs`](https://project-management-api-cyan.vercel.app/api/v1/docs)

---

## 🤝 Contributing

```bash
git checkout -b feature/your-feature
git commit -m "Add feature"
git push origin feature/your-feature
```

Then open a PR 🚀

---

## 📧 Contact

**Author:** [maulanadityaa](https://github.com/maulanadityaa)  
**Email:** maulanadityaaa@gmail.com
