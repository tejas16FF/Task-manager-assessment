import { create } from "zustand";
import axios from "axios";

const API_URL = "https://task-manager-assessment-1337.onrender.com/api/tasks";

export const useTaskStore = create((set) => ({

  tasks: [],

  // FETCH TASKS
  fetchTasks: async () => {
    try {

      const response = await axios.get(API_URL);

      set({
        tasks: response.data,
      });

    } catch (error) {

      console.log(error);

    }
  },

  // ADD TASK
  addTask: async (taskData) => {
    try {

      await axios.post(API_URL, taskData);

      const response = await axios.get(API_URL);

      set({
        tasks: response.data,
      });

    } catch (error) {

      console.log(error);

    }
  },

  // DELETE TASK
  deleteTask: async (id) => {
    try {

      await axios.delete(`${API_URL}/${id}`);

      const response = await axios.get(API_URL);

      set({
        tasks: response.data,
      });

    } catch (error) {

      console.log(error);

    }
  },

  // UPDATE TASK
  updateTask: async (id, updatedData) => {
    try {

      await axios.put(`${API_URL}/${id}`, updatedData);

      const response = await axios.get(API_URL);

      set({
        tasks: response.data,
      });

    } catch (error) {

      console.log(error);

    }
  },

  // TOGGLE COMPLETE
  toggleComplete: async (task) => {
    try {

      await axios.put(`${API_URL}/${task._id}`, {
        ...task,
        completed: !task.completed,
      });

      const response = await axios.get(API_URL);

      set({
        tasks: response.data,
      });

    } catch (error) {

      console.log(error);

    }
  },

}));