import { Request, Response, NextFunction } from "express";
import { ProjectService } from "../services/projectService";

export const getProjects = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const projects = await ProjectService.getAllProjects();
    res.json({ success: true, data: projects });
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { startingValue } = req.body;
    const userId = req.user?.userId;

    if (startingValue === undefined || startingValue === null) {
      return res.status(400).json({ success: false, message: "Starting value is required" });
    }

    const newProject = await ProjectService.createNewProject(startingValue, userId);
    res.status(201).json({ success: true, data: newProject });
  } catch (error) {
    next(error);
  }
};