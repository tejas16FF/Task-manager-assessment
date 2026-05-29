import { Link, useOutletContext } from "react-router-dom";

function ProjectsPage() {
  const { projectGroups, projects } = useOutletContext();

  const rows = projectGroups.map((group) => {
    const project = projects.find((item) => item.name === group.name) || group;
    const completedTasks = group.tasks.filter((task) => task.completed).length;
    const progress =
      group.tasks.length === 0
        ? project.progress || 0
        : Math.round((completedTasks / group.tasks.length) * 100);

    return {
      ...project,
      name: group.name,
      taskCount: group.tasks.length,
      completedTasks,
      progress,
    };
  });

  return (
    <div className="projects-page">
      <div className="page-heading">
        <div>
          <h2>Projects</h2>
          <p className="muted">
            Review each project and open details to see assigned tasks.
          </p>
        </div>
      </div>

      <div className="project-directory">
        {rows.map((project) => (
          <article className="project-directory-card" key={project._id || project.name}>
            <div>
              <h3>{project.name}</h3>
              <p className="muted">
                {project.taskCount} tasks / {project.completedTasks} completed
              </p>
            </div>

            <div className="progress-bar-wrap">
              <div
                className="progress-bar-fill"
                style={{
                  width: `${project.progress}%`,
                }}
              />
            </div>

            <div className="project-directory-footer">
              <strong>{project.progress}%</strong>
              {project._id ? (
                <Link
                  className="btn btn-secondary btn-sm"
                  to={`/project-details/${project._id}`}
                >
                  Details
                </Link>
              ) : (
                <Link
                  className="btn btn-secondary btn-sm"
                  to={`/projects/${encodeURIComponent(project.name)}`}
                >
                  Details
                </Link>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default ProjectsPage;
