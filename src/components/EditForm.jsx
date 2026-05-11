import { useState } from "react";
import { useTaskStore } from "../store/useTaskStore";

function EditForm({ task, closeModal }) {

  const { updateTask } = useTaskStore();

  const [title, setTitle] = useState(task.title);
  const [priority, setPriority] = useState(task.priority);
  const [dueDate, setDueDate] = useState(task.dueDate || "");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!title || title.trim().length < 3) {
      setError("Title must be at least 3 characters");
      return;
    }

    await updateTask(task._id, {
      title,
      priority,
      dueDate,
    });

    closeModal();
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >

      <h2>Edit Task</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1.4fr",
          gap: "14px",
        }}
      >

        <input
          type="text"
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

      </div>

      {error && (
        <p
          style={{
            color: "#ef4444",
            marginTop: "-10px",
          }}
        >
          {error}
        </p>
      )}

      <div
        style={{
          display: "flex",
          gap: "12px",
        }}
      >

        <button type="submit">
          Save
        </button>

        <button
          type="button"
          onClick={closeModal}
        >
          Cancel
        </button>

      </div>

    </form>
  );
}

export default EditForm;