import { useEffect, useState } from "react";
import { Link, useOutletContext, useParams } from "react-router-dom";
import { api } from "../utils/api";
import { useTaskStore } from "../store/useTaskStore";

function ProjectDetailsPage() {
  const { id } = useParams();
  const { isAdmin } = useOutletContext();
  const { deleteTask } = useTaskStore();

  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  async function fetchProjectDetails() {
    try {
      setLoading(true);

      const response = await api.get(`/projects/${id}`);

      setProjectData(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteTask(taskId) {
    const confirmed = window.confirm("Delete this task?");

    if (!confirmed) {
      return;
    }

    await deleteTask(taskId);
    await fetchProjectDetails();
  }

  if (loading) {
    return <p>Loading project...</p>;
  }

  if (!projectData) {
    return <p>Project not found</p>;
  }

  return (
    <div className="project-details-page">
      <div className="details-header">
        <div>
          <Link className="back-link" to="/tasks">
            Back to tasks
          </Link>
          <h2>{projectData.project.name}</h2>
          <p className="muted">Project details, members, and assigned work</p>
        </div>

        <div className="project-progress-card">
          <span>Progress</span>
          <strong>{projectData.stats.progress}%</strong>
          <div className="progress-bar-wrap">
            <div
              className="progress-bar-fill"
              style={{
                width: `${projectData.stats.progress}%`,
              }}
            />
          </div>
        </div>
      </div>

      <div className="project-details-stats">
        <div className="dashboard-item">
          <span>Total Tasks</span>
          <strong>{projectData.stats.totalTasks}</strong>
        </div>
        <div className="dashboard-item">
          <span>Completed</span>
          <strong>{projectData.stats.completedTasks}</strong>
        </div>
        <div className="dashboard-item">
          <span>Pending</span>
          <strong>{projectData.stats.pendingTasks}</strong>
        </div>
        <div className="dashboard-item">
          <span>Overdue</span>
          <strong>{projectData.stats.overdueTasks}</strong>
        </div>
      </div>

      <h3 style={{ marginTop: "30px" }}>
        Members
      </h3>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {projectData.members.map((member) => (
          <div
            key={member.user?._id}
            className="project-member-item"
          >
            <strong>{member.user?.name}</strong>

            <p>{member.user?.email}</p>

            <p>{member.role}</p>
          </div>
        ))}
      </div>

      <h3 style={{ marginTop: "30px" }}>
        Tasks
      </h3>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {projectData.tasks.map((task) => (
          <div
            key={task._id}
            className="details-task-row"
          >
            <div>
              <strong>{task.title}</strong>

              <p>
                Assigned To:
                {" "}
                {task.assignedTo?.name || "Unassigned"}
              </p>

              <p>
                Priority:
                {" "}
                {task.priority}
              </p>

              <p>
                Status:
                {" "}
                {(task.status || "pending").replace("_", " ")}
              </p>
            </div>

            <Link
              className="btn btn-secondary btn-sm"
              to={`/tasks/${task._id}`}
            >
              Details
            </Link>

            {isAdmin && (
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleDeleteTask(task._id)}
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProjectDetailsPage;
