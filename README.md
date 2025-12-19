# 🧑‍💻 Collaborative Task Manager

A **production-ready full-stack collaborative task management application** built as part of a Full-Stack Engineering Assessment.  
The application supports **secure authentication, task collaboration, real-time updates, notifications, audit logging, and a responsive dashboard UI**.

---

## 🚀 Live Demo

- **Frontend**: <FRONTEND_DEPLOYED_URL>
- **Backend API**: <BACKEND_DEPLOYED_URL>

---

## 🧰 Tech Stack

### Frontend
- **React (Vite)**
- **TypeScript**
- **Tailwind CSS**
- **React Query (TanStack Query)**
- **React Hook Form + Zod**
- **Socket.io Client**

### Backend
- **Node.js + Express**
- **TypeScript**
- **Prisma ORM**
- **PostgreSQL**
- **JWT Authentication**
- **Socket.io**
- **Jest (Testing)**

---

## 🗂️ Project Structure

```text
collaborative-task-manager/
│
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   ├── tasks/
│   │   ├── notifications/
│   │   ├── audit/
│   │   ├── socket.ts
│   │   ├── app.ts
│   │   └── server.ts
│   └── prisma/
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   ├── components/
    │   ├── hooks/
    │   ├── api/
    │   └── main.tsx

## 🔐 Authentication & Authorization

- User registration & login  
- Passwords hashed using **bcrypt**  
- JWT stored in **HttpOnly cookies**  
- Protected routes via middleware  
- Role-based permissions:
  - Only creators can delete tasks
  - Creators & assignees can update tasks

---

## 📋 Task Management (CRUD)

Each task contains:
- `title`
- `description`
- `dueDate`
- `priority` (LOW, MEDIUM, HIGH, URGENT)
- `status` (TODO, IN_PROGRESS, REVIEW, COMPLETED)
- `creatorId`
- `assignedToId`

Supported operations:
- Create task
- Update task
- Delete task
- Filter by status & priority
- Sort by due date

---

## ⚡ Real-Time Collaboration (Socket.io)

Real-time events include:
- Task assignment
- Status updates
- Priority updates
- Instant notification delivery
- Live dashboard synchronization (no refresh needed)

Sockets are authenticated using JWT from cookies and users are joined to private rooms:

```text
user:{userId}


## 🔔 Notifications System

- Persistent notifications stored in DB  
- Real-time delivery via Socket.io  
- Notification types:
  - Task assigned
  - Task status changed
- Mark individual notification as read
- Mark all notifications as read
- Notification badge updates automatically

---

## 🧾 Audit Logging (Bonus)

Every important task update is logged:
- Who updated the task
- What action was taken
- When it happened

Useful for:
- Debugging
- Accountability
- Enterprise-grade traceability

---

## 🧑‍💼 User Profile

- View profile details
- Update user name
- Email is read-only
- Profile data protected via auth middleware

---

## 📊 Dashboard Features

Dashboard includes:
- Tasks assigned to me
- Tasks created by me
- Overdue tasks
- Filtering by status & priority
- Sorting by due date
- Loading skeletons for better UX
- Task status updates use optimistic UI for instant feedback.
---

## 🎨 UI & UX

- Fully responsive layout
- Clean Tailwind design
- Navbar with:
  - Notifications
  - Profile link
  - Create Task
  - Logout
- Footer with author information
- Smooth loading and error states

---

## 🧪 Testing

Backend tests implemented using **Jest**:
- Task creation validation
- Authorization checks
- Audit logging verification

Run tests:
```bash
npm test

## 🗃️ Database Choice

PostgreSQL was chosen because:
- Strong relational integrity
- Works perfectly with Prisma
- Ideal for structured data (users, tasks, relations)
- Scales well for collaborative systems

---

## 🔌 API Endpoints

### Auth
```bash
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout

### Tasks
```bash
GET    /api/tasks
POST   /api/tasks
PUT    /api/tasks/:id
DELETE /api/tasks/:id

### Notifications
```bash
GET    /api/notifications
PATCH  /api/notifications/:id/read
PATCH  /api/notifications/read-all

### Profile
```bash
GET    /api/profile
PUT    /api/profile


## 🛠️ Local Setup

### Backend
```bash
cd backend
npm install
npx prisma migrate dev
npm run dev

### Frontend
```bash
cd frontend
npm install
npm run dev

## 🖼️ Screenshots

### Login Page
![Login Page](screenshots/login.png)

### Dashboard
![Dashboard](screenshots/dashboard.png)

### Create Task
![Create Task](screenshots/create-task.png)

### Profile Page
![Profile Page](screenshots/profile.png)


---

## ⚠️ Trade-offs & Assumptions

- No email notifications (in-app only)
- Simple role model (creator vs assignee)
- Minimal animations to keep performance optimal

---

## ✅ Final Notes

This project follows:
- Clean architecture (Controller → Service → Repository)
- Strong TypeScript typing
- DTO validation using Zod
- Modern frontend data handling
- Production-ready real-time behavior

---

## 👤 Author

Anshuman Tiwari 
Full-Stack Developer
