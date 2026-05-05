import { useTaskStore } from "../store/useTaskStore";

function TaskCard({ task }) {
  const { deleteTask } = useTaskStore();

  return (
    <div className="card">
      <div>
        <h3>{task.title}</h3>
        <span className={`badge ${task.priority.toLowerCase()}`}>
          {task.priority}
        </span>
      </div>

      <button onClick={() => deleteTask(task.id)}>
        Delete
      </button>
    </div>
  );
}

export default TaskCard;