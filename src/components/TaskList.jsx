import TaskCard from "./TaskCard";

function TaskList({ tasks }) {
  if (tasks.length === 0) {
    return (
  <p style={{ textAlign: "center", marginTop: "20px" }}>
    No tasks yet. Add one above!
  </p>
    );
  }

  return (
    <div>
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}

export default TaskList;