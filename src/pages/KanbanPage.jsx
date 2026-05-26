  import { useMemo } from "react";
  import { useTaskStore } from "../store/useTaskStore";

  const columns = [
    "pending",
    "in_progress",
    "completed",
  ];

  function getPriorityColor(priority) {
    if (!priority) return "#6b7280";

    const value = priority.toLowerCase();

    if (value === "high") {
      return "#ef4444";
    }

    if (value === "medium") {
      return "#f59e0b";
    }

    if (value === "urgent") {
      return "#dc2626";
    }

    return "#10b981";
  }

  function formatColumnTitle(column) {
    if (column === "pending") return "Pending";
    if (column === "in_progress") return "In Progress";
    if (column === "completed") return "Completed";

    return column;
  }

  function KanbanPage() {
    const { tasks, toggleComplete } = useTaskStore();

    const groupedTasks = useMemo(() => {
      return {
        pending: tasks.filter(
          (task) => task.status === "pending"
        ),

        in_progress: tasks.filter(
          (task) => task.status === "in_progress"
        ),

        completed: tasks.filter(
          (task) => task.status === "completed"
        ),
      };
    }, [tasks]);

    return (
      <div className="kanban-page">
        <h2
          style={{
            marginBottom: "20px",
          }}
        >
          Kanban Board
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(3, 1fr)",
            gap: "20px",
          }}
        >
          {columns.map((column) => (
            <div
              key={column}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "18px",
                padding: "18px",
                minHeight: "600px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "18px",
                }}
              >
                <h3>
                  {formatColumnTitle(column)}
                </h3>

                <span
                  style={{
                    background: "var(--surface-2)",
                    padding: "4px 10px",
                    borderRadius: "999px",
                    fontSize: "12px",
                    fontWeight: "600",
                  }}
                >
                  {groupedTasks[column]?.length}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                }}
              >
                {(groupedTasks[column] || []).map(
                  (task) => (
                    <div
                      key={task._id}
                      style={{
                        background: "var(--surface-2)",
                        border:
                          "1px solid var(--border)",
                        borderRadius: "16px",
                        padding: "16px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent:
                            "space-between",
                          alignItems: "start",
                          gap: "10px",
                        }}
                      >
                        <strong
                          style={{
                            fontSize: "15px",
                          }}
                        >
                          {task.title}
                        </strong>

                        <span
                          style={{
                            background:
                              getPriorityColor(
                                task.priority
                              ),
                            color: "white",
                            fontSize: "11px",
                            padding: "4px 8px",
                            borderRadius: "999px",
                            fontWeight: "600",
                          }}
                        >
                          {task.priority}
                        </span>
                      </div>

                      <div
                        style={{
                          marginTop: "12px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "6px",
                          fontSize: "13px",
                          color: "var(--muted)",
                        }}
                      >
                        <span>
                          👤{" "}
                          {task.assignedTo?.name ||
                            "Unassigned"}
                        </span>

                        <span>
                          📁{" "}
                          {task.project ||
                            "General"}
                        </span>

                        {task.dueDate && (
                          <span>
                            📅{" "}
                            {new Date(
                              task.dueDate
                            ).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      <div
                        style={{
                          marginTop: "16px",
                        }}
                      >
                        <button
                          className="btn btn-primary"
                  onClick={() =>
    toggleComplete(task._id)
  }
                        >
                          {task.status ===
                          "completed"
                            ? "Reopen Task"
                            : task.status ===
                              "pending"
                            ? "Start Task"
                            : "Complete Task"}
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  export default KanbanPage;