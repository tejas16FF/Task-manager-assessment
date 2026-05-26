import TaskCard from "./TaskCard";

function TaskList({
  isAdmin,
  tasks,
}) {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          📋
        </div>

        <p className="empty-state-text">
          No tasks found
        </p>

        <p
          className="muted"
          style={{
            fontSize: 13,
          }}
        >
          Try adjusting your
          filters or add a new
          task
        </p>
      </div>
    );
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