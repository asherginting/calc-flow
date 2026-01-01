export type NodeType = "INPUT" | "ADD" | "SUBTRACT" | "MULTIPLY" | "DIVIDE";

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface Node {
  id: string;
  type: NodeType;
  value: number;
  parentId: string | null;
  projectId: string;
  createdAt: string;
  author: {
    username: string;
  };
  children: Node[];
}

export interface Project {
  id: string;
  startingValue: number;
  createdAt: string;
  author: {
    username: string;
  } | null;
  _count?: {
    nodes: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}