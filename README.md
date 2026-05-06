# Task Manager App

A modern Task Manager application built using React, Zustand, Vite, and CSS.  
This project was developed as part of the Webmoon Technologies assessment.

---

# 🚀 Live Demo

🔗 Live URL: https://task-manager-assessment-ten.vercel.app/

---

# 📂 GitHub Repository

🔗 https://github.com/tejas16FF/task-manager-assessment

---

# ✨ Features

## ✅ Task 1 Features

- Add tasks with priority levels (Low, Medium, High)
- Delete tasks
- Filter tasks by priority
- Dynamic task count display
- Form validation (minimum 3 characters)
- Persistent storage using localStorage
- Responsive UI for mobile and desktop

---

# 🌟 Task 2 Features

## ✏️ Edit Task
- Edit button on each task card
- Modal popup with dark overlay
- Pre-filled task data in modal
- Update task title and priority
- Inline validation inside modal
- Click outside modal to close

---

## ✅ Mark Task as Complete
- Toggle tasks as completed using checkbox
- Completed tasks show:
  - Strikethrough title
  - Reduced opacity
- Added "Completed" filter tab
- Completed state persists after refresh

---

## 📅 Due Date & Overdue Highlight
- Optional due date while creating task
- Due date displayed on task cards
- Overdue tasks highlighted with:
  - Red border
  - Overdue badge
- Due date editable through Edit modal

---

## 🔍 Live Search
- Real-time search filtering
- Case-insensitive search
- Search works together with priority filters
- Displays "No tasks match your search" when empty

---

## 🌙 Dark Mode
- Light/Dark theme toggle
- Theme preference saved in localStorage
- CSS variables used for dynamic theming
- Entire app supports dark mode

---

# 🛠 Tech Stack

- React
- Zustand
- Vite
- CSS
- JavaScript

---

# 🧠 Concepts Used

- React Hooks (`useState`, `useEffect`)
- Zustand global state management
- Conditional rendering
- Controlled forms
- Dynamic filtering
- localStorage persistence
- CSS Flexbox & Grid
- CSS Variables for theming
- Modal implementation using pure CSS

---

# 📦 Setup Instructions

```bash
git clone https://github.com/tejas16FF/task-manager-assessment.git

cd task-manager-assessment

npm install

npm run dev
