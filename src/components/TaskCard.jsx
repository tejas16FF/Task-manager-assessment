import { useState } from "react";
import { Link } from "react-router-dom";

import { useTaskStore } from "../store/useTaskStore";

import EditForm from "./EditForm";

function TaskCard({
  isAdmin,
  task,
}) {
  const {
    deleteTask,
    toggleComplete,
  } = useTaskStore();

  const [isEditing, setIsEditing] =
    useState(false);

  const remarks =
    task.remarks ||
    task.description ||
    "";

  const projectName =
    task.project || "General";

  const assignedName =
    task.assignedTo?.name || "";

  const isCompleted =
    task.status === "completed";

  const dueDateLabel = task.dueDate
    ? new Date(
        task.dueDate
      ).toLocaleDateString(
        "en-GB",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      )
    : "No due date";

  const isOverdue =
    !isCompleted &&
    task.dueDate &&
    new Date(task.dueDate) <
      new Date().setHours(
        0,
        0,
        0,
        0
      );

  const cardClass = [
    "task-card",
    isCompleted
      ? "completed-card"
      : "",
    isOverdue
      ? "overdue-card"
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <div className={cardClass}>
        {!isAdmin && (
          <div className="task-check-col">
            <input
              type="checkbox"
              className="task-checkbox"
              checked={isCompleted}
              onChange={() =>
                toggleComplete(task._id)
              }
              style={{
                width: 20,
                height: 20,
                accentColor:
                  "var(--primary)",
                cursor: "pointer",
                flexShrink: 0,
              }}
            />
          </div>
        )}

        {/* Body */}
        <div className="task-body">
          <span className="task-project-tag">
            {projectName}
          </span>

          <p
            className={`task-title-text${
              isCompleted
                ? " done"
                : ""
            }`}
          >
            {task.title}
          </p>

          <div className="task-meta">
            <span
              className={`badge ${task.priority.toLowerCase()}`}
            >
              {task.priority}
            </span>

            {assignedName && (
              <span className="task-meta-item">
                <span>👤</span>

                {assignedName}
              </span>
            )}

            <span className="task-meta-item">
              <span>📅</span>

              {dueDateLabel}
            </span>

            {isOverdue && (
              <span className="badge-status overdue">
                Overdue
              </span>
            )}

            {isCompleted && (
              <span className="badge-status completed">
                Done
              </span>
            )}
          </div>

          {remarks && (
            <div className="task-remarks-row">
              <strong>Note:</strong>

              <span>{remarks}</span>
            </div>
          )}
        </div>
        <div
  style={{
    marginTop: 12,
    fontSize: 13,
    color: "var(--muted)",
    display: "flex",
    flexDirection: "column",
    gap: 4,
  }}
>
  <span>
    Assigned:
    {" "}
    {new Date(
      task.assignedAt || task.createdAt
    ).toLocaleString()}
  </span>

  {task.status ===
"pending" && (
  <span
    style={{
      color: "#f59e0b",
    }}
  >
    Waiting for acceptance/start
  </span>
)}

{task.status ===
"in_progress" && (
  <span
    style={{
      color: "#3b82f6",
    }}
  >
    In Progress
    {" • "}
    Started:
    {" "}
    {task.startedAt
      ? new Date(
          task.startedAt
        ).toLocaleString()
      : "Recently"}
  </span>
)}

{task.status ===
"completed" && (
  <span
    style={{
      color: "#10b981",
    }}
  >
    Completed:
    {" "}
    {task.completedAt
      ? new Date(
          task.completedAt
        ).toLocaleString()
      : "Completed"}
  </span>
)}


  {task.totalTimeTaken > 0 && (
    <span>
      Work Time:
      {" "}
      {Math.floor(
        task.totalTimeTaken / 3600
      )}h
      {" "}
      {Math.floor(
        (
          task.totalTimeTaken %
          3600
        ) / 60
      )}m
    </span>
  )}
</div>

        <div
          className="task-actions"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            alignSelf: "flex-start",
            marginTop: "10px",
          }}
        >
          <Link
            className="btn btn-secondary btn-sm"
            to={`/tasks/${task._id}`}
          >
            Details
          </Link>

        {isAdmin && (
          <div
  style={{
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    alignSelf: "flex-start",
    marginTop: "10px",
  }}
>
            <button
              className="btn-icon"
              onClick={() =>
                setIsEditing(true)
              }
              title="Edit task"
            >
              ✏
            </button>

            <button
              className="btn-icon"
              onClick={() =>
                deleteTask(task._id)
              }
              title="Delete task"
              style={{
                color:
                  "var(--danger)",
              }}
            >
              🗑
            </button>
          </div>
        )}
        </div>
      </div>

      {isEditing && (
        <div
          className="modal-overlay"
          onClick={() =>
            setIsEditing(false)
          }
        >
          <div
            className="modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <button
              className="modal-close"
              onClick={() =>
                setIsEditing(false)
              }
            >
              ✕
            </button>

            <EditForm
              task={task}
              closeModal={() =>
                setIsEditing(false)
              }
            />
          </div>
        </div>
      )}
    </>
  );
}

export default TaskCard;
