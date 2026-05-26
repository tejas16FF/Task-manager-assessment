const USER_ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  EMPLOYEE: "employee",
};

const LEGACY_USER_ROLES = {
  MEMBER: "member",
};

const PROJECT_STATUS = {
  PLANNING: "planning",
  ACTIVE: "active",
  ON_HOLD: "on_hold",
  COMPLETED: "completed",
  ARCHIVED: "archived",
};

const TASK_STATUS = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
};

const TASK_PRIORITY = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  URGENT: "Urgent",
};

const ACTIVITY_ACTIONS = {
  PROJECT_CREATED: "project_created",
  PROJECT_UPDATED: "project_updated",
  MEMBER_ADDED: "member_added",
  TASK_CREATED: "task_created",
  TASK_ASSIGNED: "task_assigned",
  TASK_UPDATED: "task_updated",
  TASK_COMPLETED: "task_completed",
  TASK_STARTED: "task_started",
  COMMENT_ADDED: "comment_added",
};

const NOTIFICATION_TYPES = {
  TASK_ASSIGNED: "task_assigned",
  TASK_UPDATED: "task_updated",
  TASK_DUE_SOON: "task_due_soon",
  COMMENT_ADDED: "comment_added",
  PROJECT_UPDATED: "project_updated",
};

module.exports = {
  ACTIVITY_ACTIONS,
  LEGACY_USER_ROLES,
  NOTIFICATION_TYPES,
  PROJECT_STATUS,
  TASK_PRIORITY,
  TASK_STATUS,
  USER_ROLES,
};