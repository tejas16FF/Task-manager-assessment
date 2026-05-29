import { useMemo, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { useTaskStore } from "../store/useTaskStore";

const columns = [
  {
    id: "pending",
    title: "Pending",
    hint: "Ready to start",
  },
  {
    id: "in_progress",
    title: "In Progress",
    hint: "Active work",
  },
  {
    id: "completed",
    title: "Completed",
    hint: "Finished",
  },
];

function getPriorityClass(priority = "") {
  return priority.toLowerCase() || "medium";
}

function getInitials(name = "") {
  return (
    name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U"
  );
}

function KanbanPage() {
  const { isAdmin } = useOutletContext();
  const { error, moveTaskStatus, tasks } = useTaskStore();
  const [draggedTaskId, setDraggedTaskId] = useState("");
  const [activeColumn, setActiveColumn] = useState("");

  const groupedTasks = useMemo(() => {
    return columns.reduce((groups, column) => {
      groups[column.id] = tasks.filter((task) => task.status === column.id);
      return groups;
    }, {});
  }, [tasks]);

  const handleDrop = async (status) => {
    setActiveColumn("");

    if (!draggedTaskId || isAdmin) {
      setDraggedTaskId("");
      return;
    }

    const draggedTask = tasks.find((task) => task._id === draggedTaskId);

    if (!draggedTask || draggedTask.status === status) {
      setDraggedTaskId("");
      return;
    }

    try {
      await moveTaskStatus(draggedTaskId, status);
    } finally {
      setDraggedTaskId("");
    }
  };

  return (
    <div className="kanban-page">
      <div className="page-heading kanban-heading">
        <div>
          <h2>Kanban Board</h2>
          <p className="muted">
            {isAdmin
              ? "Review work across the team. Employees move their own tasks."
              : "Drag tasks between columns as your work changes."}
          </p>
        </div>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="kanban-board">
        {columns.map((column) => (
          <section
            key={column.id}
            className={`kanban-col${
              activeColumn === column.id ? " drag-over" : ""
            }`}
            onDragOver={(event) => {
              if (!isAdmin) {
                event.preventDefault();
                setActiveColumn(column.id);
              }
            }}
            onDragLeave={() => setActiveColumn("")}
            onDrop={() => handleDrop(column.id)}
          >
            <div className="kanban-col-header">
              <div>
                <h3 className="kanban-col-title">{column.title}</h3>
                <p className="kanban-col-hint">{column.hint}</p>
              </div>

              <span className="kanban-col-count">
                {groupedTasks[column.id]?.length || 0}
              </span>
            </div>

            <div className="kanban-cards">
              {(groupedTasks[column.id] || []).map((task) => (
                <article
                  key={task._id}
                  className="kanban-card"
                  draggable={!isAdmin}
                  onDragStart={() => setDraggedTaskId(task._id)}
                  onDragEnd={() => {
                    setDraggedTaskId("");
                    setActiveColumn("");
                  }}
                >
                  <div className="kanban-card-top">
                    <h4 className="kanban-card-title">{task.title}</h4>
                    <span className={`badge ${getPriorityClass(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>

                  <div className="kanban-card-meta">
                    <span className="kanban-assignee">
                      <span className="kanban-avatar">
                        {getInitials(task.assignedTo?.name)}
                      </span>
                      {task.assignedTo?.name || "Unassigned"}
                    </span>

                    <span className="kanban-project">{task.project || "General"}</span>
                  </div>

                  <div className="kanban-card-footer">
                    <span>
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                          })
                        : "No due date"}
                    </span>

                    <Link className="btn btn-secondary btn-sm" to={`/tasks/${task._id}`}>
                      Details
                    </Link>
                  </div>
                </article>
              ))}

              {(groupedTasks[column.id] || []).length === 0 && (
                <div className="kanban-empty">Drop tasks here</div>
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

export default KanbanPage;
