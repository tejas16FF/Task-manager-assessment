import { create } from "zustand";
import { api, getErrorMessage } from "../utils/api";

function refreshTask(tasks, updatedTask) {
  return tasks.map((task) => (
    task._id === updatedTask._id ? updatedTask : task
  ));
}

export const useTaskStore = create((set) => ({
  tasks: [],
  members: [],
  projects: [],
  loading: false,
  error: "",

  // FETCH TASKS
  fetchTasks: async () => {
    set({ loading: true, error: "" });

    try {
      const response = await api.get("/tasks");

      set({
        tasks: response.data,
        loading: false,
      });
    } catch (error) {
      set({
        error: getErrorMessage(error, "Unable to load tasks"),
        loading: false,
      });
    }
  },

  fetchMembers: async () => {
    try {
      const response = await api.get("/users");
      set({ members: response.data });
    } catch (error) {
      set({ error: getErrorMessage(error, "Unable to load members") });
    }
  },

  fetchProjects: async () => {
    try {
      const response = await api.get("/projects");
      set({ projects: response.data });
    } catch (error) {
      set({ error: getErrorMessage(error, "Unable to load projects") });
    }
  },

  createProject: async (projectData) => {
    try {
      const response = await api.post("/projects", projectData);
      set((state) => {
        const exists = state.projects.some((project) => (
          project.name.toLowerCase() === response.data.name.toLowerCase()
        ));

        return {
          projects: exists
            ? state.projects
            : [...state.projects, response.data].sort((a, b) => a.name.localeCompare(b.name)),
        };
      });
      return response.data;
    } catch (error) {
      const message = getErrorMessage(error, "Unable to create project");
      set({ error: message });
      throw new Error(message, { cause: error });
    }
  },

  createMember: async (memberData) => {
    try {
      const response = await api.post("/users", memberData);
      set((state) => ({
        members: [response.data, ...state.members],
      }));
      return response.data;
    } catch (error) {
      const message = getErrorMessage(error, "Unable to create member");
      set({ error: message });
      throw new Error(message, { cause: error });
    }
  },

  // ADD TASK
  addTask: async (taskData) => {
    try {
      await api.post("/tasks", taskData);
      const [tasksResponse, projectsResponse] = await Promise.all([
        api.get("/tasks"),
        api.get("/projects"),
      ]);

      set({
        tasks: tasksResponse.data,
        projects: projectsResponse.data,
      });
    } catch (error) {
      const message = getErrorMessage(error, "Unable to add task");
      set({ error: message });
      throw new Error(message, { cause: error });
    }
  },

  // DELETE TASK
  deleteTask: async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      set((state) => ({
        tasks: state.tasks.filter((task) => task._id !== id),
      }));
    } catch (error) {
      const message = getErrorMessage(error, "Unable to delete task");
      set({ error: message });
      throw new Error(message, { cause: error });
    }
  },

  // UPDATE TASK
  updateTask: async (id, updatedData) => {
    try {
      const response = await api.put(`/tasks/${id}`, updatedData);
      const projectsResponse = await api.get("/projects");
      set((state) => ({
        projects: projectsResponse.data,
        tasks: refreshTask(state.tasks, response.data),
      }));
    } catch (error) {
      const message = getErrorMessage(error, "Unable to update task");
      set({ error: message });
      throw new Error(message, { cause: error });
    }
  },
toggleComplete: async (taskId) => {
  try {
    await api.patch(
      `/tasks/${taskId}/toggle-complete`
    );

    const response =
      await api.get("/tasks");

    set({
      tasks: response.data,
    });
  } catch (error) {
    const message =
      getErrorMessage(
        error,
        "Unable to update completion"
      );

    console.error(
      "TOGGLE ERROR:",
      error
    );

    set({ error: message });

    throw new Error(message, {
      cause: error,
    });
  }
},
moveTaskStatus: async (taskId, status) => {
  try {
    const response = await api.patch(`/tasks/${taskId}/status`, { status });

    set((state) => ({
      tasks: refreshTask(state.tasks, response.data),
    }));
  } catch (error) {
    const message = getErrorMessage(error, "Unable to move task");
    set({ error: message });
    throw new Error(message, { cause: error });
  }
},
  clearError: () => set({ error: "" }),
}));
