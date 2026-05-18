import { NavLink } from "react-router-dom";

function ProjectSidebar({
  currentUser,
  isAdmin,
  projectGroups,
  sidebarOpen,
  toggleSidebar,
  totalTasks,
}) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <span className="sidebar-brand-mark">T</span>
        </div>

        <button
          type="button"
          className="sidebar-toggle"
          onClick={toggleSidebar}
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {sidebarOpen ? "<" : ">"}
        </button>
      </div>

      <div className="profile-panel">
        <div className="profile-avatar">
          <span aria-hidden="true">{currentUser?.name?.charAt(0).toUpperCase() || "U"}</span>
        </div>
        <div>
          <strong>{currentUser?.name || "User"}</strong>
          <span>{isAdmin ? "Admin" : "User"}</span>
        </div>
      </div>

      <div className="sidebar-section">
        {isAdmin && (
          <NavLink className="project-link" title="Setup" to="/manage">
            <span className="project-icon">+</span>
            <span className="project-name">Setup</span>
            <strong>New</strong>
          </NavLink>
        )}

        <NavLink className="project-link" title="All Projects" to="/tasks" end>
          <span className="project-icon">A</span>
          <span className="project-name">All Projects</span>
          <strong>{totalTasks}</strong>
        </NavLink>

        {projectGroups.map((project) => (
          <div className="project-group" key={project.name}>
            <NavLink
              className="project-link"
              title={project.name}
              to={`/projects/${encodeURIComponent(project.name)}`}
            >
              <span className="project-icon">
                {project.name.charAt(0).toUpperCase()}
              </span>
              <span className="project-name">{project.name}</span>
              <strong>{project.tasks.length}</strong>
            </NavLink>

            <div className="project-tasks">
              {project.tasks.map((task) => (
                <NavLink
                  key={task._id}
                  to={`/projects/${encodeURIComponent(project.name)}`}
                >
                  {task.title}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default ProjectSidebar;
