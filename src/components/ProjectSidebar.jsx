import { NavLink } from "react-router-dom";

function ProjectSidebar({ currentUser, isAdmin, projectGroups, sidebarOpen, toggleSidebar, totalTasks }) {
  return (
    <aside className="sidebar">
      <button
        type="button"
        className="sidebar-toggle"
        onClick={toggleSidebar}
        aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
      >
        {sidebarOpen ? "<" : ">"}
      </button>

      <div className="profile-panel">
        <div className="profile-avatar">
          <span aria-hidden="true">&#128100;</span>
        </div>
        <div>
          <strong>{currentUser?.name || "User"}</strong>
          <span>{isAdmin ? "Admin" : "User"}</span>
        </div>
      </div>

      <div className="sidebar-section">
        {isAdmin && (
          <NavLink className="project-link" data-label="+" to="/manage">
            <span>Setup</span>
            <strong>+</strong>
          </NavLink>
        )}

        <NavLink className="project-link" data-label="A" to="/tasks" end>
          <span>All Projects</span>
          <strong>{totalTasks}</strong>
        </NavLink>

        {projectGroups.map((project) => (
          <div className="project-group" key={project.name}>
            <NavLink
              className="project-link"
              data-label={project.name.charAt(0).toUpperCase()}
              to={`/projects/${encodeURIComponent(project.name)}`}
            >
              <span>{project.name}</span>
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
