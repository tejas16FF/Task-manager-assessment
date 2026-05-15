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
      const response = await api.get("/tasks");

      set({
        tasks: response.data,
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
      set((state) => ({
        tasks: refreshTask(state.tasks, response.data),
      }));
    } catch (error) {
      const message = getErrorMessage(error, "Unable to update task");
      set({ error: message });
      throw new Error(message, { cause: error });
    }
  },

  // TOGGLE COMPLETE
  toggleComplete: async (task) => {
    try {
      const response = await api.patch(`/tasks/${task._id}/toggle-complete`);
      set((state) => ({
        tasks: refreshTask(state.tasks, response.data),
      }));
    } catch (error) {
      const message = getErrorMessage(error, "Unable to update completion");
      set({ error: message });
      throw new Error(message, { cause: error });
    }
  },

  clearError: () => set({ error: "" }),
}));
