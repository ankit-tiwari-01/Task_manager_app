# 🚀 TaskFlow - Premium Task Manager Application

TaskFlow is a modern full-stack Task Management Kanban application built with a premium React frontend and a scalable Node.js + Express backend powered by MySQL and Sequelize ORM.

The application provides secure JWT authentication, dynamic Kanban task management, task filtering, responsive UI, and real-time workspace statistics.

---

# 🌐 Live Demo

### 🔗 Frontend (Hosted on Vercel)

https://task-manager-app-tan-one.vercel.app

### 🔗 Backend API (Hosted on Render)

https://task-manager-app-4oz1.onrender.com

### 🔗 API Base URL

https://task-manager-app-4oz1.onrender.com/api/

---

# 🔐 Demo Test Credentials

Use the following credentials to test the application:

```bash
Email: test@gmail.com
Password: test@123
```

---

# ✨ Features

## 🔒 Authentication & Security

* User Registration & Login
* JWT Authentication
* Protected API Routes
* Password Encryption using bcryptjs
* Session Persistence using Local Storage
* Secure Authorization Middleware

---

## 📋 Task Management System

### 🧩 Kanban Workspace

* To Do
* In Progress
* Under Review
* Completed

### 📊 Dashboard Metrics

* Total Tasks
* Pending Tasks
* Under Review Tasks
* Completed Tasks

### ⚡ Task Features

* Create Tasks
* Edit Tasks
* Delete Tasks
* Move Tasks Between Columns
* Task Priority Management
* Search Tasks Dynamically
* Filter Tasks by Priority

---

## 🎨 Premium Frontend UI

* Fully Responsive Design
* Light Themed Workspace
* Modern Modal System
* Smooth User Experience
* Custom Confirmation Dialogues
* Interactive Board Layout

---

# 🛠️ Technology Stack

## Frontend

* React.js
* Vite
* Tailwind CSS
* Lucide React Icons
* Axios

## Backend

* Node.js
* Express.js
* Sequelize ORM
* MySQL

## Authentication & Validation

* JWT (JSON Web Tokens)
* bcryptjs
* express-validator

---

# 📂 Project Structure

```bash
task-manager-app/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

# ⚙️ Local Development Setup

## 📌 Prerequisites

Make sure the following are installed:

* Node.js
* MySQL
* Git

---

# 🔧 Backend Setup

## 1️⃣ Navigate to Backend Folder

```bash
cd backend
```

## 2️⃣ Install Dependencies

```bash
npm install
```

## 3️⃣ Configure Environment Variables

Create a `.env` file inside backend folder:

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=task_manager
DB_PORT=3306

JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h
```

## 4️⃣ Start Backend Server

```bash
npm start
```

Backend will run on:

```bash
http://localhost:5000
```

---

# 💻 Frontend Setup

## 1️⃣ Navigate to Frontend Folder

```bash
cd frontend
```

## 2️⃣ Install Dependencies

```bash
npm install
```

## 3️⃣ Configure Frontend Environment Variables

Create `.env` file:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## 4️⃣ Start Frontend Server

```bash
npm run dev
```

Frontend will run on:

```bash
http://localhost:5173
```

---

# 📡 API Endpoints

## 🔑 Authentication Routes

| Method | Endpoint           | Description   |
| ------ | ------------------ | ------------- |
| POST   | /api/auth/register | Register User |
| POST   | /api/auth/login    | Login User    |

---

## 📋 Task Routes

| Method | Endpoint       | Description   |
| ------ | -------------- | ------------- |
| GET    | /api/tasks     | Get All Tasks |
| POST   | /api/tasks     | Create Task   |
| PUT    | /api/tasks/:id | Update Task   |
| DELETE | /api/tasks/:id | Delete Task   |

---

# ☁️ Deployment

## Frontend Hosting

* Vercel

## Backend Hosting

* Render

## Database

* MySQL

---

# 📸 Application Highlights

* Full Stack Production Ready Project
* Clean Code Structure
* REST API Architecture
* Responsive UI Design
* Authentication System
* Real-Time Task Workflow
* Modern Kanban Experience

---

# 👨‍💻 Developer

Ankit Tiwari

### LinkedIn

www.linkedin.com/in/ankittiwari001

---

# 📄 License

This project is developed for learning, assessment, and company assignment purposes.
