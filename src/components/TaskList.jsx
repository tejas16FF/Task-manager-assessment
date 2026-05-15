import TaskCard from "./TaskCard";

function TaskList({ isAdmin, tasks }) {

  if (tasks.length === 0) {
    return <p>No tasks yet. Add one above!</p>;
  }

  return (
    <div>
      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          isAdmin={isAdmin}
          task={task}
        />
      ))}
    </div>
  );
}

export default TaskList;
