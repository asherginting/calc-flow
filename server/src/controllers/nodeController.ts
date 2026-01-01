import { Request, Response, NextFunction } from "express";
import { NodeService } from "../services/nodeService";
import { NodeRepository } from "../repositories/nodeRepository";

export const createNode = async (req: any, res: Response, next: NextFunction) => {
  try {
    const newNode = await NodeService.createNode(req.body, req.user.userId);
    res.status(201).json({ success: true, data: newNode });
  } catch (error: any) {
    if (error.message === "CANNOT_DIVIDE_BY_ZERO") {
      return res.status(422).json({ success: false, message: "Division by zero is forbidden" });
    }
    next(error);
  }
};

export const getNodesByProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const nodes = await NodeRepository.getNodesByProject(req.params.projectId);
    res.json({ success: true, data: nodes });
  } catch (error) {
    next(error);
  }
};