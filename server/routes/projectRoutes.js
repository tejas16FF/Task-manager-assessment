const express = require("express");

const router = express.Router();

const {
  createProject,
  getProjects,
  getProjectDetails,
} = require("../controllers/projectController");

const authMiddleware =
  require("../middleware/authMiddleware");

const authorizeRoles =
  require("../middleware/role.middleware");

/*
  Roles allowed to manage projects
*/
const canManageProjects =
  authorizeRoles(
    "admin",
    "manager"
  );

/*
  Apply authentication
  to all project routes
*/
router.use(authMiddleware);

/*
  =========================
  PROJECT ROUTES
  =========================
*/

/*
  Get all projects
  Accessible to all logged-in users
*/
router.get(
  "/",
  getProjects
);

/*
  Get single project details
  Accessible to all logged-in users
*/
router.get(
  "/:id",
  getProjectDetails
);

/*
  Create new project
  Only admin / manager
*/
router.post(
  "/",
  canManageProjects,
  createProject
);

/*
  Update project
  Only admin / manager
*/
router.put(
  "/:id",
  canManageProjects,
  async (req, res, next) => {
    try {
      const Project =
        require("../models/projectModel");

      const project =
        await Project.findByIdAndUpdate(
          req.params.id,
          {
            ...req.body,
          },
          {
            new: true,
          }
        );

      if (!project) {
        return res
          .status(404)
          .json({
            message:
              "Project not found",
          });
      }

      res.status(200).json(project);
    } catch (error) {
      next(error);
    }
  }
);

/*
  Delete project
  Only admin / manager
*/
router.delete(
  "/:id",
  canManageProjects,
  async (req, res, next) => {
    try {
      const Project =
        require("../models/projectModel");

      const project =
        await Project.findByIdAndDelete(
          req.params.id
        );

      if (!project) {
        return res
          .status(404)
          .json({
            message:
              "Project not found",
          });
      }

      res.status(200).json({
        message:
          "Project deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;