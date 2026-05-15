import { useState } from "react";
import { useTaskStore } from "../store/useTaskStore";
import EditForm from "./EditForm";

function TaskCard({ isAdmin, task }) {

  const { deleteTask, toggleComplete } = useTaskStore();

  const [isEditing, setIsEditing] = useState(false);
  const remarks = task.remarks || task.description || "";
  const assignedName = task.assignedTo?.name || "";
  const dueDateLabel = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString("en-GB")
    : "Not set";

  const isOverdue =
    !task.completed &&
    task.dueDate &&
    new Date(task.dueDate) < new Date().setHours(0, 0, 0, 0);

  return (
    <>
      <div
        className="card"
        style={{
          opacity: task.completed ? 0.65 : 1,
          border: isOverdue ? "2px solid #ef4444" : undefined,
        }}
      >

        <div className="card-layout">
          <div className="card-title-section">
            <h3
              className="task-title"
              style={{
                textDecoration: task.completed
                  ? "line-through"
                  : "none",
              }}
            >
              {task.title}
            </h3>
          </div>

          <p className="due card-due-date">
            Due date: {dueDateLabel}
          </p>

          <p className="due card-assignee">
            {assignedName ? `Assigned to ${assignedName}` : "Unassigned"}
          </p>

          <div className="card-priority">

            <span className={`badge ${task.priority.toLowerCase()}`}>
              {task.priority}
            </span>

          </div>

          <div className="card-checkbox">

            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleComplete(task)}
            />

          </div>

          <div className="card-actions">

            {isAdmin && (
              <button onClick={() => setIsEditing(true)}>
                Edit
              </button>
            )}

          </div>

          <div className="card-status">
            {isOverdue && (
              <span className="overdue">
                Overdue
              </span>
            )}
          </div>

          <div className="card-actions card-actions-right">

            {isAdmin && (
              <button onClick={() => deleteTask(task._id)}>
                Delete
              </button>
            )}

          </div>

        </div>

        <div className="remarks-section">
          <span>Remarks:</span>
          <p>{remarks || "No remarks"}</p>
        </div>

      </div>

      {/* MODAL */}
      {isEditing && (
        <div
          className="modal-overlay"
          onClick={() => setIsEditing(false)}
        >

          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >

            <EditForm
              task={task}
              closeModal={() => setIsEditing(false)}
            />

          </div>

        </div>
      )}
    </>
  );
}

export default TaskCard;
