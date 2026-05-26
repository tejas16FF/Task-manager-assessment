import { NavLink } from "react-router-dom";

// Project dot colors
const PROJECT_COLORS = [
  "#6366f1",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
];

function getProjectColor(name) {
  let hash = 0;

  for (let i = 0; i < name.length; i++) {
    hash =
      name.charCodeAt(i) +
      ((hash << 5) - hash);
  }

  return PROJECT_COLORS[
    Math.abs(hash) %
      PROJECT_COLORS.length
  ];
}

function ProjectSidebar({
  currentUser,
  isAdmin,
  projectGroups,
  sidebarOpen,
  toggleSidebar,
  totalTasks,
}) {
  const initials = currentUser?.name
    ? currentUser.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <svg
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="1"
              y="1"
              width="6"
              height="6"
              rx="1.5"
              fill="white"
              fillOpacity="0.9"
            />

            <rect
              x="9"
              y="1"
              width="6"
              height="6"
              rx="1.5"
              fill="white"
              fillOpacity="0.6"
            />

            <rect
              x="1"
              y="9"
              width="6"
              height="6"
              rx="1.5"
              fill="white"
              fillOpacity="0.6"
            />

            <rect
              x="9"
              y="9"
              width="6"
              height="6"
              rx="1.5"
              fill="white"
              fillOpacity="0.9"
            />
          </svg>
        </div>

        <div>
          <div className="sidebar-brand-text">
            TaskFlow
          </div>

          <span className="sidebar-brand-sub">
            Workspace
          </span>
        </div>

        <button
          className="sidebar-toggle"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
          title={
            sidebarOpen
              ? "Collapse"
              : "Expand"
          }
        >
          {sidebarOpen ? "‹" : "›"}
        </button>
      </div>

      {/* Profile */}
      <div className="profile-panel">
        <div className="profile-avatar">
          {initials}
        </div>

        <div className="profile-info">
          <span className="profile-name">
            {currentUser?.name || "User"}
          </span>

          <span
            className={`role-badge ${
              isAdmin
                ? "admin"
                : "user"
            }`}
          >
            {isAdmin
              ? "Admin"
              : "Member"}
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        <div className="sidebar-section-label">
          Main
        </div>

        <NavLink
          className={({ isActive }) =>
            `nav-item${
              isActive
                ? " active"
                : ""
            }`
          }
          to="/tasks"
          end
          title="Tasks"
        >
          <span className="nav-icon">
            ☑
          </span>

          <span className="nav-label">
            Tasks
          </span>

          <span className="nav-count">
            {totalTasks}
          </span>
        </NavLink>

        <NavLink
          className={({ isActive }) =>
            `nav-item${
              isActive
                ? " active"
                : ""
            }`
          }
          to="/kanban"
          title="Kanban"
        >
          <span className="nav-icon">
            ⊞
          </span>

          <span className="nav-label">
            Kanban Board
          </span>
        </NavLink>
<NavLink
  className={({ isActive }) =>
    `nav-item${
      isActive
        ? " active"
        : ""
    }`
  }
  to="/analytics"
  title="Analytics"
>
  <span className="nav-icon">
    📊
  </span>

  <span className="nav-label">
    Analytics
  </span>
</NavLink>
        <NavLink
          className={({ isActive }) =>
            `nav-item${
              isActive
                ? " active"
                : ""
            }`
          }
          to="/activities"
          title="Activity"
        >
          <span className="nav-icon">
            ⚡
          </span>

          <span className="nav-label">
            Activity
          </span>
        </NavLink>

        {isAdmin && (
  <NavLink
    className={({ isActive }) =>
      `nav-item${isActive ? " active" : ""}`
    }
    to="/employees"
    title="Employees"
  >
    <span className="nav-icon">👥</span>
    <span className="nav-label">
      Employees
    </span>
  </NavLink>
)}

        {isAdmin && (
          <>
            <div
              className="sidebar-section-label"
              style={{
                marginTop: 8,
              }}
            >
              Admin
            </div>

            <NavLink
              className={({
                isActive,
              }) =>
                `nav-item${
                  isActive
                    ? " active"
                    : ""
                }`
              }
              to="/manage"
              title="Setup"
            >
              <span className="nav-icon">
                ⚙
              </span>

              <span className="nav-label">
                Setup
              </span>
            </NavLink>
          </>
        )}

        {projectGroups.length >
          0 && (
          <>
            <div
              className="sidebar-section-label"
              style={{
                marginTop: 8,
              }}
            >
              Projects
            </div>
          </>
        )}
      </nav>

      {projectGroups.length >
        0 && (
        <div className="sidebar-projects-section">
          {projectGroups.map(
            (project) => (
              <NavLink
                key={project.name}
                className={({
                  isActive,
                }) =>
                  `project-item${
                    isActive
                      ? " active"
                      : ""
                  }`
                }
                to={`/projects/${encodeURIComponent(
                  project.name
                )}`}
                title={project.name}
              >
                <span
                  className="project-dot"
                  style={{
                    background:
                      getProjectColor(
                        project.name
                      ),
                  }}
                />

                <span className="project-item-name">
                  {project.name}
                </span>

                <span className="project-item-count">
                  {
                    project.tasks
                      .length
                  }
                </span>
              </NavLink>
            )
          )}
        </div>
      )}
    </aside>
  );
}

export default ProjectSidebar;