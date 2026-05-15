import { useState } from "react";
import { useTaskStore } from "../store/useTaskStore";

function TaskForm() {

  const { addTask, members, tasks } = useTaskStore();

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Low");
  const [dueDate, setDueDate] = useState("");
  const [remarks, setRemarks] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
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

      const sameAssignee =
        (task.assignedTo?._id || task.assignedTo || "") === assignedTo;

      return (
        sameTitle &&
        samePriority &&
        sameDueDate &&
        sameAssignee
      );

    });

    if (duplicateTask) {

      setError("Task already exists");
      return;

    }

    if (!assignedTo) {

      setError("Assign the task to a team member");
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
        assignedTo,
        completed: false,
      });

      // RESET FORM
      setTitle("");
      setPriority("Low");
      setDueDate("");
      setRemarks("");
      setAssignedTo("");
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

        <select
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
        >
          <option value="">Assign to</option>
          {members.map((member) => (
            <option key={member._id} value={member._id}>
              {member.name} ({member.role})
            </option>
          ))}
        </select>

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
