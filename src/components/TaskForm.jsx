import { useState } from "react";
import { useTaskStore } from "../store/useTaskStore";

function TaskForm() {
  const { addTask } = useTaskStore();

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Low");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || title.trim().length < 3) {
      setError("Title must be at least 3 characters");
      return;
    }

    addTask({
      id: Date.now(),
      title,
      priority,
    });

    setTitle("");
    setPriority("Low");
    setError("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter task"
        value={title}
        onChange={(e) => {
            setTitle(e.target.value);
            setError("");
            }}
        />

      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
      >
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>

      <button type="submit" disabled={title.trim().length < 3}>
        Add Task
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}

export default TaskForm;