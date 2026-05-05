import { useState } from "react";
import { useTaskStore } from "../store/useTaskStore";

function TaskForm() {
  const { addTask } = useTaskStore();

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Low");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ validation ONLY on submit
    if (!title || title.trim().length < 3) {
      setError("Title must be at least 3 characters");
      return;
    }

    // ✅ add task
    addTask({
      id: Date.now(),
      title,
      priority,
    });

    // ✅ reset form
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
        onChange={(e) => setTitle(e.target.value)}
      />

      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
      >
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>

      {/* ✅ always clickable */}
      <button type="submit">Add Task</button>

      {/* ✅ error shows ONLY after clicking */}
      {error && (
        <p style={{ color: "red", marginTop: "5px" }}>
          {error}
        </p>
      )}
    </form>
  );
}

export default TaskForm;