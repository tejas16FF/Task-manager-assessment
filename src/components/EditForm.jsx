import { useState } from "react";

import { useTaskStore } from "../store/useTaskStore";

import { getProjectNames } from "../utils/projectGroups";

function EditForm({
  task,
  closeModal,
}) {
  const {
    members,
    projects,
    tasks,
    updateTask,
  } = useTaskStore();

  const [title, setTitle] =
    useState(task.title);

  const [project, setProject] =
    useState(
      task.project || "General"
    );

  const [priority, setPriority] =
    useState(task.priority);

  const [dueDate, setDueDate] =
    useState(
      task.dueDate || ""
    );

  const [remarks, setRemarks] =
    useState(
      task.remarks ||
        task.description ||
        ""
    );

  const [assignedTo, setAssignedTo] =
    useState(
      task.assignedTo?._id ||
        task.assignedTo ||
        ""
    );

  const [error, setError] =
    useState("");

  const projectNames =
    getProjectNames(tasks, projects);

  const firstWord =
    project
      .trim()
      .split(/\s+/)[0]
      ?.toLowerCase() || "";

  const suggestedProjectNames =
    firstWord
      ? projectNames.filter((n) =>
          n
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

    await updateTask(task._id, {
      title,

      project:
        project.trim() ||
        "General",

      priority,

      dueDate,

      remarks:
        remarks.trim(),

      description:
        remarks.trim(),

      assignedTo,
    });

    closeModal();
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <h2>Edit Task</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr 1fr",
          gap: 10,
        }}
      >
        <div
          style={{
            gridColumn:
              "1 / -1",
          }}
        >
          <label className="input-label">
            Title
          </label>

          <input
            type="text"
            value={title}
            onChange={(e) =>
              setTitle(
                e.target.value
              )
            }
            placeholder="Task title"
          />
        </div>

        <div>
          <label className="input-label">
            Project
          </label>

          <input
            type="text"
            placeholder="Project name"
            value={project}
            onChange={(e) =>
              setProject(
                e.target.value
              )
            }
            list="edit-proj-sug"
          />

          <datalist id="edit-proj-sug">
            {suggestedProjectNames.map(
              (n) => (
                <option
                  key={n}
                  value={n}
                />
              )
            )}
          </datalist>
        </div>

        <div>
          <label className="input-label">
            Priority
          </label>

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
        </div>

        <div>
          <label className="input-label">
            Due Date
          </label>

          <input
            type="date"
            value={dueDate}
            onChange={(e) =>
              setDueDate(
                e.target.value
              )
            }
          />
        </div>

        <div>
          <label className="input-label">
            Assign To
          </label>

          <select
            value={assignedTo}
            onChange={(e) =>
              setAssignedTo(
                e.target.value
              )
            }
          >
            <option value="">
              Select member...
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

        <div
          style={{
            gridColumn:
              "1 / -1",
          }}
        >
          <label className="input-label">
            Remarks
          </label>

          <input
            type="text"
            placeholder="Add a note..."
            value={remarks}
            onChange={(e) =>
              setRemarks(
                e.target.value
              )
            }
          />
        </div>
      </div>

      {error && (
        <p className="error">
          {error}
        </p>
      )}

      <div
        style={{
          display: "flex",
          gap: 10,
        }}
      >
        <button
          type="submit"
          className="btn btn-primary"
        >
          Save Changes
        </button>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={closeModal}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default EditForm;