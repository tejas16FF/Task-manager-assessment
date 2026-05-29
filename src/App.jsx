import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import ManagePage from "./pages/ManagePage";
import ProjectTasksPage from "./pages/ProjectTasksPage";
import ProjectDetailsPage from "./pages/ProjectDetailsPage";
import Register from "./pages/Register";
import TasksPage from "./pages/TasksPage";
import TaskDetailsPage from "./pages/TaskDetailsPage";
import EmployeesPage from "./pages/EmployeesPage";
import ActivityPage from "./pages/ActivityPage";
import KanbanPage from "./pages/KanbanPage";
import AnalyticsPage from "./pages/AnalyticsPage";
function App() {
  const [theme, setTheme] = useState(() => (
    localStorage.getItem("theme") || "light"
  ));

  // APPLY THEME
  useEffect(() => {
    document.body.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout theme={theme} setTheme={setTheme} />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/tasks" replace />} />
        <Route path="tasks" element={<TasksPage />} />
        <Route path="tasks/:id" element={<TaskDetailsPage />} />
        <Route path="employees" element={<EmployeesPage />} />
        <Route path="employees/:id" element={<EmployeesPage />} />
        <Route path="activities" element={<ActivityPage />} />
        <Route path="kanban" element={<KanbanPage />} />
        <Route
  path="analytics"
  element={<AnalyticsPage />}
/>
        <Route path="manage" element={<ManagePage />} />
        <Route path="projects/:projectName" element={<ProjectTasksPage />} />
        <Route path="project-details/:id" element={<ProjectDetailsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
