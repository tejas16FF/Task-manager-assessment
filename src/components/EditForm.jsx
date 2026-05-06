import { useState } from "react";
import { useTaskStore } from "../store/useTaskStore";

function EditForm({ task, closeModal }) {
  const { updateTask } = useTaskStore();

  const [title, setTitle] = useState(task.title);
  const [priority, setPriority] = useState(task.priority);
  const [dueDate, setDueDate] = useState(task.dueDate || "");
  const [error, setError] = useState("");

  const handleSave = () => {
    if (!title || title.trim().length < 3) {
      setError("Title must be at least 3 characters");
      return;
    }

    updateTask(task.id, {
      title,
      priority,
      dueDate: dueDate || null,
    });

    closeModal();
  };

  return (
    <div>
      <h2>Edit Task</h2>

      <input
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

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button onClick={handleSave}>Save</button>
      <button onClick={closeModal}>Cancel</button>
    </div>
  );
}

export default EditForm;