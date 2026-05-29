import { Link, useOutletContext } from "react-router-dom";
import { useTaskStore } from "../store/useTaskStore";

function ProjectsPage() {
  const { projects } = useOutletContext();
  const { deleteProject } = useTaskStore();

  const handleDelete = async (project) => {
    if (!project._id) {
      return;
    }

    const confirmed = window.confirm(
      `Delete "${project.name}" and all tasks in this project?`
    );

    if (confirmed) {
      await deleteProject(project._id);
    }
  };

  const rows = projects.map((project) => ({
    ...project,
    taskCount: project.stats?.totalTasks || 0,
    completedTasks: project.stats?.completedTasks || 0,
    progress: project.progress || 0,
  }));

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
              <div className="project-card-actions">
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

                {project._id && (
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(project)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default ProjectsPage;
