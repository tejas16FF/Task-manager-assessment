# 🚀 Task Manager App

A full-stack Task Manager application built using the MERN stack principles with React, Express, MongoDB, Zustand, and Vite.

This project was developed as part of the Webmoon Technologies Assessment.

---

# 🌐 Live Demo

🔗 https://task-manager-assessment-ten.vercel.app/

---

# 📂 GitHub Repository

🔗 https://github.com/tejas16FF/Task-manager-assessment

---

# ✨ Features

## ✅ Core Features

- Add new tasks
- Edit existing tasks
- Delete tasks
- Mark tasks as completed
- Dynamic task count display
- Real-time UI updates
- Responsive design for mobile & desktop

---

# 📌 Task Management Features

## ➕ Add Tasks

- Create tasks with:
  - Title
  - Priority
  - Due Date
- Validation for minimum title length
- Tasks stored in MongoDB Atlas

---

## ✏️ Edit Tasks

- Edit button on each task card
- Modal popup editor
- Pre-filled task information
- Update:
  - Task title
  - Priority
  - Due date
- Inline validation support
- Click outside modal to close

---

## 🗑 Delete Tasks

- Delete tasks instantly
- UI updates automatically after deletion
- MongoDB data synced in real-time

---

## ✅ Task Completion

- Toggle task completion using checkbox
- Completed tasks display:
  - Strikethrough text
  - Reduced opacity
- Completion state stored in database

---

# 🔍 Filtering & Search

## 🎯 Priority Filtering

Filter tasks by:
- All
- Low
- Medium
- High
- Completed

---

## 🔎 Live Search

- Real-time task search
- Case-insensitive matching
- Works together with filters
- Displays empty-state message when no tasks match

---

# 📅 Due Date & Overdue Detection

- Optional due dates
- Due dates shown on task cards
- Overdue tasks automatically highlighted
- Overdue indicators include:
  - Red border
  - Overdue badge

---

# 🌙 Dark Mode

- Light/Dark theme toggle
- Theme persistence using localStorage
- Full application dark mode support
- CSS variable-based theming

---

# ⚡ Backend Features

- REST API using Express.js
- MongoDB Atlas cloud database
- Mongoose schema & models
- Full CRUD operations:
  - Create
  - Read
  - Update
  - Delete
- Error handling with HTTP status codes

---

# 🛠 Tech Stack

## Frontend
- React
- Vite
- Zustand
- Axios
- CSS

---

## Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose

---

# 🧠 Concepts Used

## Frontend Concepts

- React Hooks
  - `useState`
  - `useEffect`
- Zustand global state management
- Controlled forms
- Conditional rendering
- Dynamic filtering
- Real-time search
- Async/Await
- Axios API calls
- Modal implementation

---

## Backend Concepts

- REST APIs
- Express Routing
- Middleware
- HTTP Methods
  - GET
  - POST
  - PUT
  - DELETE
- MongoDB CRUD operations
- Mongoose Models & Schemas
- Async database operations
- Error handling

---

# 📁 Folder Structure

```bash
task-manager/
│
├── server/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── .env
│
├── src/
│   ├── components/
│   ├── store/
│   ├── App.jsx
│   └── main.jsx
│
├── public/
├── package.json
└── vite.config.js