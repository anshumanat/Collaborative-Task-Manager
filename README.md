# 📘 Collaborative Task Manager

## 📌 Project Overview

The **Collaborative Task Manager** is a full-stack web application that enables teams to manage tasks collaboratively with **real-time updates**.

It supports secure authentication, task assignment, role-based authorization, and real-time notifications using WebSockets.

This project was built as part of a **Full Stack Developer assignment**, with a strong focus on **engineering quality, clean architecture, and real-time collaboration**.

---

## 🚀 Features

### 🔐 Authentication & Authorization
- User registration and login
- JWT-based authentication stored in **HttpOnly cookies**
- Secure logout
- Protected routes using middleware

### 📋 Task Management
- Create, update, and delete tasks
- Assign tasks to users
- Task status tracking:
  - TODO
  - IN_PROGRESS
  - REVIEW
  - COMPLETED
- Priority levels:
  - LOW
  - MEDIUM
  - HIGH
  - URGENT
- Authorization rules:
  - Only task creators can delete tasks
  - Task creators and assignees can update tasks

### 🔔 Real-Time Collaboration
- Real-time notifications using **Socket.io**
- Notifications when:
  - A task is assigned to a user
  - A task status is updated
- User-specific socket rooms for targeted real-time updates

### 🖥️ Frontend
- Login page
- Task list page
- Real-time alerts for task events
- Minimal UI focused on functionality

---

## 🏗️ Tech Stack

### Backend
- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT (Authentication)
- Socket.io

### Frontend
- React (TypeScript)
- Socket.io Client
- Fetch API

---

## 🧠 Architecture Overview

The backend follows a **layered architecture**:

Controller → Service → Repository → Database


### Why this architecture?
- Clear separation of concerns
- Easier maintenance and scalability
- Cleaner and testable business logic

### Real-Time Design
- Socket.io initialized once at server startup
- JWT authentication during socket handshake
- Each user joins a room: `user:<userId>`
- Events are emitted from the **service layer**, not controllers

---

## 📂 Project Structure

Collaborative-Task-Manager
├── backend
│ ├── src
│ │ ├── auth
│ │ ├── tasks
│ │ ├── middlewares
│ │ ├── socket.ts
│ │ ├── app.ts
│ │ └── server.ts
│ └── prisma
│
├── frontend
│ └── src
│ ├── pages
│ ├── api
│ └── App.tsx
│
└── README.md


## ▶️ How to Run the Project Locally
1️⃣ Clone the Repository
git clone <your-github-repo-url>
cd Collaborative-Task-Manager

2️⃣ Backend Setup
cd backend
npm install


Run database migrations:

npx prisma migrate dev


Start the backend server:

npm run dev


Backend runs on:

http://localhost:5000

3️⃣ Frontend Setup
cd ../frontend
npm install
npm start


Frontend runs on:

http://localhost:3000


## 🔄 Real-Time Functionality Demo

Login as User A

Login as User B (in another browser or incognito)

Assign a task to User B

User B receives a real-time notification

Updating task status sends updates to both users

## 🧪 Notes for Reviewers

This project prioritizes engineering correctness and architecture

UI is intentionally minimal to focus on backend and real-time functionality

Prisma v5 is used for stability

No authentication tokens are stored in localStorage

## ✅ Submission Checklist

 Authentication & Authorization

 Task CRUD

 Real-time updates

 Clean architecture

 GitHub commits

 Documentation

🙌 Author
Anshuman
Full Stack Developer 