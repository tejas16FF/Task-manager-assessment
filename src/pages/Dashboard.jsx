import { useEffect, useState } from "react";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import FilterBar from "../components/FilterBar";
import MemberForm from "../components/MemberForm";
import { useAuthStore } from "../store/useAuthStore";
import { useTaskStore } from "../store/useTaskStore";

function Dashboard({ theme, setTheme }) {
  const { currentUser, logout } = useAuthStore();
  const { error, fetchMembers, fetchTasks, loading, tasks } = useTaskStore();

  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const isAdmin = currentUser?.role === "admin";
  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = tasks.length - completedTasks;

  useEffect(() => {
    fetchTasks();

    if (isAdmin) {
      fetchMembers();
    }
  }, [fetchTasks, fetchMembers, isAdmin]);

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
    <div className="container">
      <div className="top-bar">
        <div>
          <h1>Task Manager</h1>
          <p className="user-line">
            {currentUser?.name} - {currentUser?.role}
          </p>
        </div>

        <div className="top-actions">
          <button
            type="button"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? "Dark" : "Light"}
          </button>

          <button type="button" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      {isAdmin && (
        <>
          <MemberForm />
          <TaskForm />
        </>
      )}

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
    </div>
  );
}

export default Dashboard;
