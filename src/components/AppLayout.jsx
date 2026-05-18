import { useEffect, useMemo, useState } from "react";
import { Outlet } from "react-router-dom";
import ProjectSidebar from "./ProjectSidebar";
import { useAuthStore } from "../store/useAuthStore";
import { useTaskStore } from "../store/useTaskStore";
import { buildProjectGroupsWithProjects } from "../utils/projectGroups";

function AppLayout({ theme, setTheme }) {
  const { currentUser, logout } = useAuthStore();
  const {
    fetchMembers,
    fetchProjects,
    fetchTasks,
    members,
    projects,
    tasks,
  } = useTaskStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const isAdmin = currentUser?.role === "admin";
  const projectGroups = useMemo(
    () => buildProjectGroupsWithProjects(tasks, projects),
    [projects, tasks]
  );

  useEffect(() => {
    fetchTasks();
    fetchProjects();

    if (isAdmin) {
      fetchMembers();
    }
  }, [fetchMembers, fetchProjects, fetchTasks, isAdmin]);

  return (
    <div className={`app-shell ${sidebarOpen ? "" : "sidebar-collapsed"}`}>
      <ProjectSidebar
        currentUser={currentUser}
        isAdmin={isAdmin}
        projectGroups={projectGroups}
        sidebarOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen((open) => !open)}
        totalTasks={tasks.length}
      />

      <main className="container">
        <div className="top-bar">
          <div>
            <h1>Task Manager</h1>
            <p className="user-line">
              {isAdmin ? "Admin workspace" : "Assigned workspace"}
            </p>
          </div>

          <div className="top-actions">
            <button
              type="button"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {theme === "light" ? "Dark" : "Light"}
            </button>

            <button type="button" onClick={logout}>
              Logout
            </button>
          </div>
        </div>

        <Outlet
          context={{
            currentUser,
            isAdmin,
            members,
            projectGroups,
            projects,
            tasks,
          }}
        />
      </main>
    </div>
  );
}

export default AppLayout;
