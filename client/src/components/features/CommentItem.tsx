import React, { useState } from "react";
import { IconReply, IconUser } from "../common/Icons";
import type { Node, NodeType } from "../../types";

interface CommentItemProps {
  node: Node;
  onReply: (parentId: string, type: string, value: number) => void;
  parentValue: number | null;
}

export const CommentItem = ({ node, onReply, parentValue }: CommentItemProps) => {
  const [showReply, setShowReply] = useState(false);
  const [replyVal, setReplyVal] = useState("");
  // Default type kita set ke ADD
  const [replyType, setReplyType] = useState<NodeType>("ADD");

  // --- LOGIKA MATEMATIKA REKURSIF ---
  let currentValue = node.value; 
  
  if (parentValue !== null) {
    switch (node.type) {
      case "ADD": 
        currentValue = parentValue + node.value; 
        break;
      // Gunakan nama lengkap sesuai tipe Prisma/Types
      case "SUBTRACT": 
        currentValue = parentValue - node.value; 
        break;
      case "MULTIPLY": 
        currentValue = parentValue * node.value; 
        break;
      case "DIVIDE": 
        currentValue = node.value !== 0 ? parentValue / node.value : 0; 
        break;
      default:
        currentValue = node.value;
    }
  }
  // ---------------------------------

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyVal) return;
    onReply(node.id, replyType, Number(replyVal));
    setShowReply(false);
    setReplyVal("");
  };

  // Helper untuk menampilkan simbol matematika
  const getSymbol = (type: string) => {
    switch (type) {
      case "ADD": return "+";
      case "SUBTRACT": return "-";
      case "MULTIPLY": return "×";
      case "DIVIDE": return "÷";
      default: return "?";
    }
  };

  // Helper untuk warna badge
  const getBadgeColor = (type: string) => {
    switch (type) {
      case "ADD": return "bg-green-100 text-green-700";
      case "SUBTRACT": return "bg-red-100 text-red-700";
      case "MULTIPLY": return "bg-purple-100 text-purple-700";
      case "DIVIDE": return "bg-orange-100 text-orange-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="relative pl-4 sm:pl-8 border-l-2 border-gray-100 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="mb-3 bg-white hover:bg-gray-50 p-4 rounded-xl border border-gray-100 transition-colors group">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg">
            <IconUser className="w-3 h-3" />
          </div>
          <span className="text-xs font-bold text-gray-700">{node.author?.username || "Anonymous"}</span>
          <span className="text-[10px] text-gray-400">• {new Date(node.createdAt).toLocaleTimeString()}</span>
        </div>

        {/* MATH DISPLAY */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-lg font-mono">
            {node.type === "INPUT" ? (
              <span className="font-bold text-blue-600">Start: {node.value}</span>
            ) : (
              <>
                <span className="text-gray-400">{parentValue}</span>
                <span className={`font-bold px-2 py-0.5 rounded text-sm ${getBadgeColor(node.type)}`}>
                  {getSymbol(node.type)} {node.value}
                </span>
                <span className="text-gray-400">=</span>
                <span className="font-bold text-gray-900 border-b-2 border-blue-500">{currentValue}</span>
              </>
            )}
          </div>
        </div>

        <div className="mt-3 flex gap-4">
          <button onClick={() => setShowReply(!showReply)} className="text-xs font-bold text-gray-400 hover:text-blue-600 flex items-center gap-1 transition-colors">
            <IconReply /> Reply
          </button>
        </div>
      </div>

      {showReply && (
        <form onSubmit={handleSubmit} className="mb-4 ml-4 flex gap-2 animate-in zoom-in-95">
          <select 
            className="px-3 py-2 bg-gray-50 border rounded-lg text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500" 
            value={replyType} 
            onChange={(e) => setReplyType(e.target.value as NodeType)}
          >
            {/* VALUE DI SINI HARUS SESUAI DENGAN NODETYPE */}
            <option value="ADD">+</option>
            <option value="SUBTRACT">-</option>
            <option value="MULTIPLY">×</option>
            <option value="DIVIDE">÷</option>
          </select>
          <input 
            autoFocus 
            type="number" 
            placeholder="Num" 
            className="w-24 px-3 py-2 bg-gray-50 border rounded-lg text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500" 
            value={replyVal} 
            onChange={e => setReplyVal(e.target.value)} 
          />
          <button className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700">Add</button>
        </form>
      )}

      {/* REKURSIF */}
      <div className="space-y-2">
        {node.children && node.children.map(child => (
          <CommentItem 
            key={child.id} 
            node={child} 
            onReply={onReply} 
            parentValue={currentValue} 
          />
        ))}
      </div>
    </div>
  );
};