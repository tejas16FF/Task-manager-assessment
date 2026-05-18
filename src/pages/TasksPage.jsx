import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import FilterBar from "../components/FilterBar";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import { useTaskStore } from "../store/useTaskStore";

function TasksPage() {
  const { isAdmin, tasks } = useOutletContext();
  const { error, loading } = useTaskStore();
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = tasks.length - completedTasks;

  const filteredTasks = tasks.filter((task) => {
    const matchesFilter =
      filter === "All"
        ? true
        : filter === "Completed"
          ? task.completed
          : task.priority === filter;

    const matchesSearch = task.title
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <>
      <div className="page-heading">
        <h2>Tasks</h2>
        <p className="muted">
          {isAdmin ? "Create and assign tasks." : "Tasks assigned to you."}
        </p>
      </div>

      {isAdmin && <TaskForm />}

      <div className="dashboard">
        <div className="dashboard-item">
          <span>Total Tasks</span>
          <strong>{tasks.length}</strong>
        </div>

        <div className="dashboard-item">
          <span>Completed</span>
          <strong>{completedTasks}</strong>
        </div>

        <div className="dashboard-item">
          <span>Pending</span>
          <strong>{pendingTasks}</strong>
        </div>
      </div>

      <FilterBar filter={filter} setFilter={setFilter} />

      <input
        type="text"
        placeholder="Search tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search"
      />

      {error && <p className="error">{error}</p>}
      {loading && <p className="muted">Loading tasks...</p>}

      <p className="muted">Showing {filteredTasks.length} tasks</p>

      {filteredTasks.length === 0 && !loading ? (
        <p className="muted">
          {isAdmin ? "No tasks match your search" : "No assigned tasks found"}
        </p>
      ) : (
        <TaskList tasks={filteredTasks} isAdmin={isAdmin} />
      )}
    </>
  );
}

export default TasksPage;
