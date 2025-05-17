export const BASE_URL = "http://localhost:8000";

// utils/apiPath.js
export const API_PATHS = {
  AUTH: {
    REGISTER: "api/auth/register",
    LOGIN: "api/auth/login",
    GET_PROFILE: "api/auth/profile",
  },

  USERS: {
    GET_ALL_USERS: "api/users",
    GET_USER_BY_ID: (userId) =>`api/users/${userId}`,
    CREATE_USER: "api/users",
    UPDATE_USER: (userId) =>`api/users/${userId}`,
    DELETE_USER: (userId) =>`api/users/${userId}`,
  },

  TASKS: {
    GET_DASHBOARD_DATA: "/api/tasks/dashboard-data", // Get Dashboard Data
    GET_USER_DASHBOARD_DATA: "/api/tasks/user-dashboard-data", // Get User Dash
    GET_ALL_TASKS: "/api/tasks", // Get all tasks (Admin: all, User: only assig
    GET_TASK_BY_ID: (taskId) => "/api/tasks/${taskId}", // Get task by ID
    CREATE_TASK: "/api/tasks", // Create a new task (Admin only)
    UPDATE_TASK: (taskId) => "/api/tasks/${taskId}", // Update task details
    DELETE_TASK: (taskId) => "/api/tasks/${taskId}", // Delete a task (Admin or

    UPDATE_TASK_STATUS: (taskId) => "/api/tasks/${taskId}/status", // Update ta
    UPDATE_TODO_CHECKLIST: (taskId) => "/api/tasks/${taskId}/todo", //
  },

  REPORTS: {
    EXPORT_TASKS: "/api/reports/export/tasks", // Download all tasks as an Excel
    EXPORT_USERS: "/api/reports/export/users", // Download user-task report
  },

  IMAGE: {
    UPLOAD_IMAGE: "api/auth/upload-image",
  },
};
