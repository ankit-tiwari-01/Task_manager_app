# TaskFlow - Premium Task Manager Application

TaskFlow is a state-of-the-art, full-stack Task Management Kanban workspace built on a modern, high-fidelity React frontend and a robust Node.js/Express backend, backed by MySQL database persistence using Sequelize.

---

## 🌟 Key Features

### 🔒 Connected Authentication & JWT Route Protection
- **Split-Screen Authentication**: A stunning, premium login and registration UI designed with split screens, featuring a royal purple-to-cyan gradient on one side and a clean switcher tab, validation triggers, and secure inputs on the other.
- **Auto-Session Restore**: Restores user sessions automatically from local storage on load.
- **JWT Authorization**: Protects REST API endpoints utilizing JSON Web Tokens in authorization headers.

### 📋 Light-Themed Kanban Workspace
- **Real-Time Workspace Metrics**: A horizontal stats bar showing total tasks, pending list items, under-review counts, and completed records.
- **Dynamic Kanban Board Columns**: Visual board columns (**To Do**, **In Progress**, **Under Review**, **Completed**) featuring live counters.
- **Task Search & Priority Filters**: Filter tasks dynamically by typing title queries or picking priority ranks (High 🔥, Medium ⚡, Low 🌱).
- **Inline Stage Traversal**: Quick left/right navigation arrow triggers to transition task cards between board columns.
- **Action Modals**: Dedicated modal sliders to create and edit tasks, selecting custom board columns, priorities, and calendars.
- **Custom Confirmation Dialogue**: Exchanged default browser confirms with custom caution overlays.

---

## 🛠️ Technology Stack

- **Frontend**: React, Vite, Tailwind CSS v4, Lucide React (Icons).
- **Backend**: Node.js, Express, Sequelize ORM, MySQL.
- **Authentication**: JWT, bcryptjs, express-validator.

---

## ⚙️ Local Setup Guide

### Prerequisites
- Node.js installed locally.
- MySQL server running locally.
- A database named `task_manager` created in MySQL.

### 1. Database Setup
Ensure MySQL is active, and configure database attributes under `/backend/.env`:
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

### 2. Backend Installation & Startup
1. Navigate to `/backend`.
2. Install packages:
   ```bash
   npm install
   ```
3. Run the API server:
   ```bash
   npm start
   ```
   *The database models will sync, and the server will listen on http://localhost:5000.*

### 3. Frontend Installation & Startup
1. Navigate to `/frontend`.
2. Add environment config `/frontend/.env`:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```
3. Install packages:
   ```bash
   npm install
   ```
4. Run the hot-reloading dev workspace:
   ```bash
   npm run dev
   ```
   *Open your browser and explore the app at http://localhost:5173/.*
