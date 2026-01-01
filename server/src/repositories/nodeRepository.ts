import prisma from "../prisma";

export const NodeRepository = {
  async findById(id: string) {
    return prisma.node.findUnique({ where: { id } });
  },

  async createNode(data: any) {
    return prisma.node.create({
      data,
      include: { author: { select: { username: true } } },
    });
  },

  async getNodesByProject(projectId: string) {
    return prisma.node.findMany({
      where: { projectId },
      include: { author: { select: { username: true } } },
      orderBy: { createdAt: "asc" },
    });
  }
};