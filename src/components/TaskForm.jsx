import { useState } from "react";

import { useTaskStore } from "../store/useTaskStore";

import { getProjectNames } from "../utils/projectGroups";

function TaskForm({
  defaultProject = "",
}) {
  const {
    addTask,
    members,
    projects,
    tasks,
  } = useTaskStore();

  const [title, setTitle] =
    useState("");

  const [project, setProject] =
    useState(defaultProject);

  const [priority, setPriority] =
    useState("Low");

  const [dueDate, setDueDate] =
    useState("");

  const [remarks, setRemarks] =
    useState("");

  const [assignedTo, setAssignedTo] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const projectNames =
    getProjectNames(tasks, projects);

  const firstWord =
    project
      .trim()
      .split(/\s+/)[0]
      ?.toLowerCase() || "";

  const suggestedProjectNames =
    firstWord
      ? projectNames.filter((name) =>
          name
            .toLowerCase()
            .startsWith(firstWord)
        )
      : projectNames;

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    if (
      !title ||
      title.trim().length < 3
    ) {
      setError(
        "Title must be at least 3 characters"
      );

      return;
    }

    const duplicateTask =
      tasks.find((task) => {
        const sameTitle =
          task.title
            .trim()
            .toLowerCase() ===
          title
            .trim()
            .toLowerCase();

        const samePriority =
          task.priority === priority;

        const sameProject =
          (
            task.project ||
            "General"
          )
            .trim()
            .toLowerCase() ===
          (
            project.trim() ||
            "General"
          ).toLowerCase();

        const sameDueDate =
          (task.dueDate || "") ===
          (dueDate || "");

        const sameAssignee =
          (
            task.assignedTo?._id ||
            task.assignedTo ||
            ""
          ) === assignedTo;

        return (
          sameTitle &&
          sameProject &&
          samePriority &&
          sameDueDate &&
          sameAssignee
        );
      });

    if (duplicateTask) {
      setError(
        "Task already exists"
      );

      return;
    }

    if (!assignedTo) {
      setError(
        "Please assign the task to a team member"
      );

      return;
    }

    try {
      setLoading(true);

      await addTask({
        title,

        project:
          project.trim() ||
          "General",

        priority,

        dueDate:
          dueDate || null,

        remarks:
          remarks.trim(),

        description:
          remarks.trim(),

        assignedTo,

        completed: false,
      });

      setTitle("");

      setProject(
        defaultProject
      );

      setPriority("Low");

      setDueDate("");

      setRemarks("");

      setAssignedTo("");

      setError("");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="task-form-card"
      style={{
        opacity: loading
          ? 0.6
          : 1,

        pointerEvents:
          loading
            ? "none"
            : "auto",
      }}
    >
      <h3>
        <span
          style={{
            color:
              "var(--primary)",
          }}
        >
          +
        </span>

        New Task
      </h3>

      <form
        onSubmit={handleSubmit}
      >
        <div className="task-form-grid">
          <input
            type="text"
            placeholder="Task title..."
            value={title}
            onChange={(e) =>
              setTitle(
                e.target.value
              )
            }
          />

          <input
            type="text"
            placeholder="Project"
            value={project}
            onChange={(e) =>
              setProject(
                e.target.value
              )
            }
            list="project-suggestions"
          />

          <datalist id="project-suggestions">
            {suggestedProjectNames.map(
              (n) => (
                <option
                  key={n}
                  value={n}
                />
              )
            )}
          </datalist>

          <select
            value={priority}
            onChange={(e) =>
              setPriority(
                e.target.value
              )
            }
          >
            <option>
              Low
            </option>

            <option>
              Medium
            </option>

            <option>
              High
            </option>
          </select>

          <input
            type="date"
            value={dueDate}
            onChange={(e) =>
              setDueDate(
                e.target.value
              )
            }
          />

          <select
            value={assignedTo}
            onChange={(e) =>
              setAssignedTo(
                e.target.value
              )
            }
          >
            <option value="">
              Assign to...
            </option>

            {members.map((m) => (
              <option
                key={m._id}
                value={m._id}
              >
                {m.name} (
                {m.role})
              </option>
            ))}
          </select>
        </div>

        <div className="task-form-row">
          <input
            type="text"
            placeholder="Add a note or remark..."
            value={remarks}
            onChange={(e) =>
              setRemarks(
                e.target.value
              )
            }
          />

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading
              ? "Adding..."
              : "Add Task"}
          </button>
        </div>

        {error && (
          <p
            className="error"
            style={{
              marginTop: 10,
            }}
          >
            {error}
          </p>
        )}
      </form>
    </div>
  );
}

export default TaskForm;