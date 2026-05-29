const projectService = require("../services/project.service");
const asyncHandler = require("../utils/asyncHandler");

const getProjects = asyncHandler(async (req, res) => {
  const projects = await projectService.getProjects(req.user);
  return res.json(projects);
});

const createProject = asyncHandler(async (req, res) => {
  const project = await projectService.createProject(req.body, req.user);
  return res.status(201).json(project);
});

const deleteProject = asyncHandler(async (req, res) => {
  const result = await projectService.deleteProject(req.params.id);
  return res.json(result);
});

const getProjectDetails = asyncHandler(async (req, res) => {
  const project = await projectService.getProjectDetails(
    req.params.id
  );

  return res.json(project);
});
module.exports = {
  createProject,
  deleteProject,
  getProjects,
  getProjectDetails,
};
