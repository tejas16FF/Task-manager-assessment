import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";

import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";

import { useTaskStore } from "../store/useTaskStore";

import socket from "../services/socketClient";

function TasksPage() {
  const {
    isAdmin,
    tasks,
    members,
    projects,
  } = useOutletContext();

  const {
    error,
    loading,
    fetchTasks,
  } = useTaskStore();

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [priorityFilter, setPriorityFilter] =
    useState("All");

  const [memberFilter, setMemberFilter] =
    useState("All");

  const [projectFilter, setProjectFilter] =
    useState("All");

  const [sortBy, setSortBy] =
    useState("Newest");

  useEffect(() => {
    const user = JSON.parse(
      localStorage.getItem("user")
    );

    if (user?._id) {
      socket.emit(
        "join-user-room",
        user._id
      );
    }

    socket.on(
      "task-created",
      async (data) => {
        await fetchTasks();

        alert(
          `New Task Created: ${data.title}`
        );
      }
    );

    socket.on(
      "notification",
      (data) => {
        alert(data.message);
      }
    );

    return () => {
      socket.off("task-created");
      socket.off("notification");
    };
  }, [fetchTasks]);

  const completedTasks =
    tasks.filter(
      (task) => task.completed
    ).length;

  const pendingTasks =
    tasks.length -
    completedTasks;

  const filteredTasks =
    useMemo(() => {
      let filtered = [...tasks];

      // SEARCH
      filtered = filtered.filter(
        (task) =>
          task.title
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );

      // STATUS
      if (
        statusFilter !== "All"
      ) {
        if (
          statusFilter ===
          "Completed"
        ) {
          filtered =
            filtered.filter(
              (task) =>
                task.completed
            );
        }

        if (
          statusFilter ===
          "Pending"
        ) {
          filtered =
            filtered.filter(
              (task) =>
                !task.completed
            );
        }

        if (
          statusFilter ===
          "Overdue"
        ) {
          filtered =
            filtered.filter(
              (task) =>
                !task.completed &&
                task.dueDate &&
                new Date(
                  task.dueDate
                ) <
                  new Date()
            );
        }
      }

      // PRIORITY
      if (
        priorityFilter !==
        "All"
      ) {
        filtered =
          filtered.filter(
            (task) =>
              task.priority ===
              priorityFilter
          );
      }

      // MEMBER
      if (
        memberFilter !== "All"
      ) {
        filtered =
          filtered.filter(
            (task) =>
              task.assignedTo
                ?.name ===
              memberFilter
          );
      }

      // PROJECT
      if (
        projectFilter !==
        "All"
      ) {
        filtered =
          filtered.filter(
            (task) =>
              (task.project ||
                "General") ===
              projectFilter
          );
      }

      // SORTING
      if (sortBy === "Newest") {
        filtered.sort(
          (a, b) =>
            new Date(
              b.createdAt
            ) -
            new Date(
              a.createdAt
            )
        );
      }

      if (sortBy === "Oldest") {
        filtered.sort(
          (a, b) =>
            new Date(
              a.createdAt
            ) -
            new Date(
              b.createdAt
            )
        );
      }

      if (
        sortBy ===
        "Priority"
      ) {
        const order = {
          High: 3,
          Medium: 2,
          Low: 1,
        };

        filtered.sort(
          (a, b) =>
            order[b.priority] -
            order[a.priority]
        );
      }

      return filtered;
    }, [
      tasks,
      search,
      statusFilter,
      priorityFilter,
      memberFilter,
      projectFilter,
      sortBy,
    ]);

  return (
    <>
      <div className="page-heading">
        <h2>Tasks</h2>

        <p className="muted">
          {isAdmin
            ? "Create and assign tasks."
            : "Tasks assigned to you."}
        </p>
      </div>

      {isAdmin && <TaskForm />}

      <div className="dashboard">
        <div className="dashboard-item">
          <span>
            Total Tasks
          </span>

          <strong>
            {tasks.length}
          </strong>
        </div>

        <div className="dashboard-item">
          <span>
            Completed
          </span>

          <strong>
            {completedTasks}
          </strong>
        </div>

        <div className="dashboard-item">
          <span>Pending</span>

          <strong>
            {pendingTasks}
          </strong>
        </div>
      </div>

      {/* FILTER BAR */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "2fr repeat(5, 1fr)",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="search"
        />

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(
              e.target.value
            )
          }
        >
          <option>All</option>
          <option>
            Pending
          </option>
          <option>
            Completed
          </option>
          <option>
            Overdue
          </option>
        </select>

        <select
          value={
            priorityFilter
          }
          onChange={(e) =>
            setPriorityFilter(
              e.target.value
            )
          }
        >
          <option>All</option>
          <option>Low</option>
          <option>
            Medium
          </option>
          <option>High</option>
        </select>

        <select
          value={memberFilter}
          onChange={(e) =>
            setMemberFilter(
              e.target.value
            )
          }
        >
          <option>All</option>

          {members.map(
            (member) => (
              <option
                key={member._id}
              >
                {member.name}
              </option>
            )
          )}
        </select>

        <select
          value={projectFilter}
          onChange={(e) =>
            setProjectFilter(
              e.target.value
            )
          }
        >
          <option>All</option>

          {projects.map(
            (project) => (
              <option
                key={project._id}
              >
                {project.name}
              </option>
            )
          )}
        </select>

        <select
          value={sortBy}
          onChange={(e) =>
            setSortBy(
              e.target.value
            )
          }
        >
          <option>
            Newest
          </option>

          <option>
            Oldest
          </option>

          <option>
            Priority
          </option>
        </select>
      </div>

      {/* CLEAR FILTERS */}

      <div
        style={{
          marginBottom: "18px",
        }}
      >
        <button
          className="btn"
          onClick={() => {
            setSearch("");

            setStatusFilter(
              "All"
            );

            setPriorityFilter(
              "All"
            );

            setMemberFilter(
              "All"
            );

            setProjectFilter(
              "All"
            );

            setSortBy(
              "Newest"
            );
          }}
        >
          Clear Filters
        </button>
      </div>

      {error && (
        <p className="error">
          {error}
        </p>
      )}

      {loading && (
        <p className="muted">
          Loading tasks...
        </p>
      )}

      <p className="muted">
        Showing{" "}
        {
          filteredTasks.length
        }{" "}
        tasks
      </p>

      {filteredTasks.length ===
        0 && !loading ? (
        <p className="muted">
          {isAdmin
            ? "No tasks match your filters"
            : "No assigned tasks found"}
        </p>
      ) : (
        <TaskList
          tasks={filteredTasks}
          isAdmin={isAdmin}
        />
      )}
    </>
  );
}

export default TasksPage;