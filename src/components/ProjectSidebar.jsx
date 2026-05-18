function ProjectSidebar({
  currentUser,
  isAdmin,
  projectGroups,
  selectedProject,
  setSelectedProject,
  totalTasks,
}) {
  return (
    <aside className="sidebar">
      <div className="profile-panel">
        <div className="profile-avatar">👤</div>
        <div>
          <strong>{currentUser?.name || "User"}</strong>
          <span>{isAdmin ? "Admin" : "User"}</span>
        </div>
      </div>

      <div className="sidebar-section">
        <button
          type="button"
          className={`project-link ${selectedProject === "All" ? "active" : ""}`}
          onClick={() => setSelectedProject("All")}
        >
          <span>All Projects</span>
          <strong>{totalTasks}</strong>
        </button>

        {projectGroups.map((project) => (
          <div className="project-group" key={project.name}>
            <button
              type="button"
              className={`project-link ${selectedProject === project.name ? "active" : ""}`}
              onClick={() => setSelectedProject(project.name)}
            >
              <span>{project.name}</span>
              <strong>{project.tasks.length}</strong>
            </button>

            <div className="project-tasks">
              {project.tasks.map((task) => (
                <button
                  type="button"
                  key={task._id}
                  onClick={() => setSelectedProject(project.name)}
                >
                  {task.title}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default ProjectSidebar;
