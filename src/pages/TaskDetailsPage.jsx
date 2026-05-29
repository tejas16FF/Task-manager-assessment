import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api, getErrorMessage } from "../utils/api";

function formatDate(value) {
  if (!value) {
    return "Not set";
  }

  return new Date(value).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatStatus(status = "") {
  return status.replace("_", " ");
}

function TaskDetailsPage() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTask() {
      try {
        setLoading(true);
        setError("");
        const response = await api.get(`/tasks/${id}`);
        setTask(response.data);
      } catch (requestError) {
        setError(getErrorMessage(requestError, "Unable to load task"));
      } finally {
        setLoading(false);
      }
    }

    fetchTask();
  }, [id]);

  const workTime = useMemo(() => {
    if (!task?.totalTimeTaken) {
      return "Not tracked yet";
    }

    const hours = Math.floor(task.totalTimeTaken / 3600);
    const minutes = Math.floor((task.totalTimeTaken % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }, [task]);

  if (loading) {
    return <p className="muted">Loading task...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (!task) {
    return <p className="muted">Task not found</p>;
  }

  return (
    <div className="details-page">
      <div className="details-header">
        <div>
          <Link className="back-link" to="/tasks">
            Back to tasks
          </Link>
          <h2>{task.title}</h2>
          <p className="muted">{task.project || "General"}</p>
        </div>

        <span className={`status-pill ${task.status}`}>
          {formatStatus(task.status)}
        </span>
      </div>

      <div className="details-grid">
        <section className="details-panel">
          <h3>Task Summary</h3>
          <div className="details-list">
            <div>
              <span>Assigned to</span>
              <strong>{task.assignedTo?.name || "Unassigned"}</strong>
            </div>
            <div>
              <span>Created by</span>
              <strong>{task.createdBy?.name || "Unknown"}</strong>
            </div>
            <div>
              <span>Priority</span>
              <strong>{task.priority}</strong>
            </div>
            <div>
              <span>Due date</span>
              <strong>{formatDate(task.dueDate)}</strong>
            </div>
          </div>
        </section>

        <section className="details-panel">
          <h3>Timeline</h3>
          <div className="details-list">
            <div>
              <span>Assigned</span>
              <strong>{formatDate(task.assignedAt || task.createdAt)}</strong>
            </div>
            <div>
              <span>Started</span>
              <strong>{formatDate(task.startedAt)}</strong>
            </div>
            <div>
              <span>Completed</span>
              <strong>{formatDate(task.completedAt)}</strong>
            </div>
            <div>
              <span>Work time</span>
              <strong>{workTime}</strong>
            </div>
          </div>
        </section>
      </div>

      <section className="details-panel">
        <h3>Notes</h3>
        <p className="details-note">
          {task.remarks || task.description || "No notes added for this task."}
        </p>
      </section>
    </div>
  );
}

export default TaskDetailsPage;
