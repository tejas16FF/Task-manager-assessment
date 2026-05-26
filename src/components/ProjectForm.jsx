import { useState } from "react";
import { useTaskStore } from "../store/useTaskStore";

function ProjectForm() {
  const {
    createProject,
    projects,
  } = useTaskStore();

  const [name, setName] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    setError("");
    setMessage("");

    try {
      setLoading(true);

      await createProject({
        name,
      });

      setName("");

      setMessage(
        "Project created successfully"
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="member-panel">
      <div className="member-panel-header">
        <div>
          <h2>Projects</h2>

          <p className="muted">
            Manage workspace
            projects
          </p>
        </div>

        <div className="dashboard-item">
          <strong>
            {projects.length}
          </strong>

          <span>
            Projects
          </span>
        </div>
      </div>

      <form
        className="member-form"
        onSubmit={handleSubmit}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "2fr auto",
            gap: "14px",
            alignItems:
              "center",
          }}
        >
          <input
            type="text"
            placeholder="Enter project name..."
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{
              minWidth: "170px",
            }}
          >
            {loading
              ? "Creating..."
              : "Create Project"}
          </button>
        </div>
      </form>

      <div
        style={{
          marginTop: "28px",
        }}
      >
        <h3
          style={{
            marginBottom: "14px",
          }}
        >
          Existing Projects
        </h3>

        <div
          className="project-chip-list"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          {projects.map(
            (project) => (
              <div
                key={
                  project._id ||
                  project.name
                }
                style={{
                  background:
                    "rgba(124,108,255,0.10)",

                  border:
                    "1px solid rgba(124,108,255,0.35)",

                  padding:
                    "10px 16px",

                  borderRadius:
                    "999px",

                  display:
                    "flex",

                  alignItems:
                    "center",

                  gap: "10px",

                  color:
                    "var(--text)",

                  fontWeight:
                    "600",

                  boxShadow:
                    "0 2px 8px rgba(124,108,255,0.08)",
                }}
              >
                <span
                  style={{
                    width: "10px",

                    height:
                      "10px",

                    borderRadius:
                      "50%",

                    background:
                      "#7c6cff",
                  }}
                />

                {project.name}
              </div>
            )
          )}
        </div>
      </div>

      {error && (
        <p className="error">
          {error}
        </p>
      )}

      {message && (
        <p className="success">
          {message}
        </p>
      )}
    </div>
  );
}

export default ProjectForm;