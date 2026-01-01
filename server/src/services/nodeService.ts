import { NodeRepository } from "../repositories/nodeRepository";
import { calculateValue } from "../domain/calculator";
import { io } from "../index";

export const NodeService = {
  async createNode(payload: any, userId: string) {
    const { projectId, parentId, type, value } = payload;

    // 1. Logika Kalkulasi jika ada parent
    let calculatedResult = parseFloat(value);
    if (parentId) {
      const parent = await NodeRepository.findById(parentId);
      if (!parent) throw new Error("PARENT_NOT_FOUND");
      
      // Menggunakan domain calculator untuk hitung hasil baru
      calculatedResult = calculateValue(parent.value, type, calculatedResult);
    }

    // 2. Simpan ke Repo
    const newNode = await NodeRepository.createNode({
      type,
      value: calculatedResult,
      projectId,
      parentId: parentId || null,
      authorId: userId,
      x: payload.x ?? 0,
      y: payload.y ?? 0,
    });

    // 3. Emit Socket
    io.emit("REFRESH_FEED", { type: "NEW_REPLY", projectId, data: newNode });

    return newNode;
  }
};