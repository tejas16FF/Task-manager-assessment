import { useState } from "react";
import { useTaskStore } from "../store/useTaskStore";

function TaskForm() {

  const { addTask } = useTaskStore();

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Low");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!title || title.trim().length < 3) {
      setError("Title must be at least 3 characters");
      return;
    }

    await addTask({
      title,
      priority,
      dueDate: dueDate || null,
      completed: false,
    });

    // RESET FORM
    setTitle("");
    setPriority("Low");
    setDueDate("");
    setError("");
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="task-form"
      >

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

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <button type="submit">
          Add Task
        </button>

      </form>

      {error && (
        <p className="error">
          {error}
        </p>
      )}
    </>
  );
}

export default TaskForm;