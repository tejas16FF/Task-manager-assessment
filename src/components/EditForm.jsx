import { useState } from "react";
import { useTaskStore } from "../store/useTaskStore";

function EditForm({ task, closeModal }) {

  const { updateTask } = useTaskStore();

  const [title, setTitle] = useState(task.title);
  const [priority, setPriority] = useState(task.priority);
  const [dueDate, setDueDate] = useState(task.dueDate);

  const handleSubmit = (e) => {
    e.preventDefault();

    updateTask(task.id, {
      title,
      priority,
      dueDate,
    });

    closeModal();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="edit-form"
    >

      <h2>Edit Task</h2>

      <input
        type="text"
        value={title}
        onChange={(e) =>
          setTitle(e.target.value)
        }
      />

      <select
        value={priority}
        onChange={(e) =>
          setPriority(e.target.value)
        }
      >
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>

      <input
        type="date"
        value={dueDate}
        onChange={(e) =>
          setDueDate(e.target.value)
        }
      />

      <div className="edit-actions">
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