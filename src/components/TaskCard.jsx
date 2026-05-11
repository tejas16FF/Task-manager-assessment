import { useState } from "react";
import { useTaskStore } from "../store/useTaskStore";
import EditForm from "./EditForm";

function TaskCard({ task }) {

  const { deleteTask, toggleComplete } = useTaskStore();

  const [isEditing, setIsEditing] = useState(false);

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

        {/* TOP */}
        <div className="card-top">

          {/* LEFT */}
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

            {task.dueDate && (
              <p className="due">
                {new Date(task.dueDate).toLocaleDateString()}
              </p>
            )}

            {isOverdue && (
              <span className="overdue">
                Overdue
              </span>
            )}

          </div>

          {/* CENTER */}
          <div className="card-priority">

            <span className={`badge ${task.priority.toLowerCase()}`}>
              {task.priority}
            </span>

          </div>

          {/* RIGHT */}
          <div className="card-checkbox">

            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleComplete(task)}
            />

          </div>

        </div>

        {/* ACTIONS */}
        <div className="card-actions">

          <button onClick={() => setIsEditing(true)}>
            Edit
          </button>

          <div style={{ flex: 1 }} />

          <button onClick={() => deleteTask(task._id)}>
            Delete
          </button>

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