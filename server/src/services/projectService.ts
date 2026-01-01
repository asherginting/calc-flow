import prisma from "../prisma";
import { io } from "../index";

export const ProjectService = {
  async getAllProjects() {
    return await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { username: true } },
        _count: { select: { nodes: true } },
      },
    });
  },

  async createNewProject(startingValue: string, userId: string) {
    const newProject = await prisma.project.create({
      data: {
        startingValue: parseFloat(startingValue),
        authorId: userId,
      },
      include: {
        author: { select: { username: true } },
        _count: { select: { nodes: true } },
      },
    });

    io.emit("REFRESH_FEED", {
      type: "NEW_PROJECT",
      data: newProject,
    });

    return newProject;
  }
};