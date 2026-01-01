import type { Node } from "../types";

export const buildTree = (nodes: Node[]): Node[] => {
  const nodeMap = new Map<string, Node>();
  const tree: Node[] = [];

  nodes.forEach((node) => {
    nodeMap.set(node.id, { ...node, children: [] });
  });

  nodes.forEach((node) => {
    const mappedNode = nodeMap.get(node.id);
    
    if (!mappedNode) return;

    if (node.parentId && nodeMap.has(node.parentId)) {
      nodeMap.get(node.parentId)!.children.push(mappedNode);
    } else {
      tree.push(mappedNode);
    }
  });

  const sortNodes = (nodeList: Node[]) => {
    nodeList.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    nodeList.forEach(node => {
      if (node.children.length > 0) {
        sortNodes(node.children);
      }
    });
  };

  sortNodes(tree);
  return tree;
};