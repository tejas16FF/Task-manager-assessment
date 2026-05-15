# Task Manager Team App

A MERN task management app upgraded into a role-based team task system. It keeps the original task features, dark mode, filtering, search, task cards, due dates, remarks, and completion flow, then adds JWT authentication, users, assignment, and role permissions.

## Features

- JWT authentication with register, login, logout, and persisted session state
- Password hashing with bcrypt
- Admin and member roles
- Admin dashboard for all tasks, assignment, edits, deletion, and member creation
- Member dashboard for assigned tasks only
- Dedicated completion toggle API so members cannot update other fields
- MongoDB models with Mongoose refs for `assignedTo` and `createdBy`
- React Router protected routes
- Zustand stores for auth and tasks
- Existing dark mode, filters, search, responsive layout, task cards, priorities, remarks, and overdue highlighting

## Role System

Admin users can:

- Create team members
- Create tasks
- Assign tasks to users
- Edit title, remarks, priority, due date, and assignee
- Delete tasks
- View all tasks
- Toggle completion

Member users can:

- Login
- View only tasks assigned to them
- Toggle completed or uncompleted status

Members cannot edit task details, delete tasks, assign tasks, or create users. These rules are enforced by backend middleware and controllers, not only by frontend UI checks.

## Authentication Flow

1. A user registers or logs in through the React pages.
2. The backend validates credentials and returns a JWT plus a sanitized user object.
3. The frontend stores the token and current user in localStorage for session persistence.
4. Axios attaches the token as `Authorization: Bearer <token>`.
5. Protected backend routes use `authMiddleware` to verify the token.
6. Admin-only routes also use `adminMiddleware`.
7. Frontend protected routes redirect unauthenticated users to `/login`.

The first registered user is automatically created as an admin so a fresh database can be bootstrapped. Later users created from the public register page become members. Admins can create members or admins from the dashboard.

## API

Auth:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

Tasks:

- `GET /api/tasks`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`
- `PATCH /api/tasks/:id/toggle-complete`

Users:

- `GET /api/users`
- `POST /api/users`

## Folder Structure

```bash
task-manager/
  server/
    controllers/
      authController.js
      taskController.js
      userController.js
    middleware/
      adminMiddleware.js
      authMiddleware.js
    models/
      Task.js
      User.js
    routes/
      authRoutes.js
      taskRoutes.js
      userRoutes.js
    utils/
      generateToken.js
    server.js
  src/
    components/
      EditForm.jsx
      FilterBar.jsx
      MemberForm.jsx
      ProtectedRoute.jsx
      TaskCard.jsx
      TaskForm.jsx
      TaskList.jsx
    pages/
      Dashboard.jsx
      Login.jsx
      Register.jsx
    store/
      useAuthStore.js
      useTaskStore.js
    utils/
      api.js
    App.jsx
    main.jsx
```

## Environment Variables

Create `server/.env`:

```bash
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
PORT=5000
```

For the frontend, create `.env` in the project root when the API is not running at `http://localhost:5000/api`:

```bash
VITE_API_URL=https://your-api-url.com/api
```

## Run Locally

Install frontend dependencies:

```bash
npm install
```

Install backend dependencies:

```bash
cd server
npm install
```

Start the backend:

```bash
cd server
npm run dev
```

Start the frontend:

```bash
npm run dev
```

## Verification

```bash
npm run lint
npm run build
```
