import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import ManagePage from "./pages/ManagePage";
import ProjectTasksPage from "./pages/ProjectTasksPage";
import Register from "./pages/Register";
import TasksPage from "./pages/TasksPage";

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
        <Route path="manage" element={<ManagePage />} />
        <Route path="projects/:projectName" element={<ProjectTasksPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
