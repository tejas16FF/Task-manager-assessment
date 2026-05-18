import { useState } from "react";
import { useTaskStore } from "../store/useTaskStore";

function ProjectForm() {
  const { createProject, projects } = useTaskStore();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      setLoading(true);
      await createProject({ name });
      setName("");
      setMessage("Project created");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="member-panel">
      <div className="member-panel-header">
        <h2>Projects</h2>
        <span>{projects.length} projects</span>
      </div>

      <form className="member-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Project"}
        </button>
      </form>

      <div className="project-chip-list">
        {projects.map((project) => (
          <span key={project._id || project.name}>{project.name}</span>
        ))}
      </div>

      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}
    </div>
  );
}

export default ProjectForm;
