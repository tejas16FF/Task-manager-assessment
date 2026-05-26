import { useEffect, useMemo, useState } from "react";
import { Outlet } from "react-router-dom";

import ProjectSidebar from "./ProjectSidebar";

import { useAuthStore } from "../store/useAuthStore";
import { useTaskStore } from "../store/useTaskStore";

import { buildProjectGroupsWithProjects } from "../utils/projectGroups";

function AppLayout({ theme, setTheme }) {
  const { currentUser, logout } =
    useAuthStore();

  const {
    fetchMembers,
    fetchProjects,
    fetchTasks,
    members,
    projects,
    tasks,
  } = useTaskStore();

  const [sidebarOpen, setSidebarOpen] =
    useState(true);

  const isAdmin =
    currentUser?.role === "admin";

  const projectGroups = useMemo(
    () =>
      buildProjectGroupsWithProjects(
        tasks,
        projects
      ),
    [projects, tasks]
  );

  useEffect(() => {
    fetchTasks();

    fetchProjects();

    if (isAdmin) {
      fetchMembers();
    }
  }, [
    fetchMembers,
    fetchProjects,
    fetchTasks,
    isAdmin,
  ]);

  return (
    <div
      className={`app-shell ${
        sidebarOpen
          ? ""
          : "sidebar-collapsed"
      }`}
    >
      <ProjectSidebar
        currentUser={currentUser}
        isAdmin={isAdmin}
        projectGroups={projectGroups}
        sidebarOpen={sidebarOpen}
        toggleSidebar={() =>
          setSidebarOpen((o) => !o)
        }
        totalTasks={tasks.length}
      />

      <div className="main-content">
        {/* Top bar */}
        <header className="topbar">
          <span className="topbar-title">
            TaskFlow
          </span>

          <span className="topbar-sub">
            {isAdmin
              ? "Admin workspace"
              : "My workspace"}
          </span>

          <div className="topbar-spacer" />

          <div className="topbar-actions">
            <button
              className="theme-btn"
              title="Toggle theme"
              onClick={() =>
                setTheme(
                  theme === "light"
                    ? "dark"
                    : "light"
                )
              }
            >
              {theme === "light"
                ? "🌙"
                : "☀️"}
            </button>

            <button
              className="logout-btn"
              onClick={logout}
            >
              <span>↩</span>

              Logout
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="page-content">
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
    </div>
  );
}

export default AppLayout;