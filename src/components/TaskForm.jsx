import { useState } from "react";
import { useTaskStore } from "../store/useTaskStore";

function TaskForm() {

  const { addTask, tasks } = useTaskStore();

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Low");
  const [dueDate, setDueDate] = useState("");
  const [remarks, setRemarks] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!title || title.trim().length < 3) {

      setError("Title must be at least 3 characters");
      return;

    }

    // DUPLICATE CHECK
    const duplicateTask = tasks.find((task) => {

      const sameTitle =
        task.title.trim().toLowerCase() ===
        title.trim().toLowerCase();

      const samePriority =
        task.priority === priority;

      const sameDueDate =
        (task.dueDate || "") === (dueDate || "");

      return (
        sameTitle &&
        samePriority &&
        sameDueDate
      );

    });

    if (duplicateTask) {

      setError("Task already exists");
      return;

    }

    try {

      setLoading(true);

      await addTask({
        title,
        priority,
        dueDate: dueDate || null,
        remarks: remarks.trim(),
        description: remarks.trim(),
        completed: false,
      });

      // RESET FORM
      setTitle("");
      setPriority("Low");
      setDueDate("");
      setRemarks("");
      setError("");

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="task-form"
        style={{
          opacity: loading ? 0.6 : 1,
          pointerEvents: loading ? "none" : "auto",
          transition: "0.2s ease",
        }}
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

        <input
          type="text"
          placeholder="Remarks"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          className="remarks-input"
        />

        <button
          type="submit"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Task"}
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
