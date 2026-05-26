import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../utils/api";

function ProjectDetailsPage() {
  const { id } = useParams();

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

  if (loading) {
    return <p>Loading project...</p>;
  }

  if (!projectData) {
    return <p>Project not found</p>;
  }

  return (
    <div className="project-details-page">
      <h2>{projectData.project.name}</h2>

      <p>
        Progress:
        {" "}
        {projectData.stats.progress}%
      </p>

      <p>
        Total Tasks:
        {" "}
        {projectData.stats.totalTasks}
      </p>

      <p>
        Completed:
        {" "}
        {projectData.stats.completedTasks}
      </p>

      <p>
        Pending:
        {" "}
        {projectData.stats.pendingTasks}
      </p>

      <p>
        Overdue:
        {" "}
        {projectData.stats.overdueTasks}
      </p>

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
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "12px",
            }}
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
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "12px",
            }}
          >
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
              {task.completed
                ? "Completed"
                : "Pending"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProjectDetailsPage;