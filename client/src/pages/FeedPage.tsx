import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { socket } from "../api/socket";
import { buildTree } from "../utils/treeBuilder";
import { CommentItem } from "../components/features/CommentItem";
import { useAuthStore } from "../store/authStore";
import { IconPlus, IconLogout } from "../components/common/Icons";
import type { Project, Node } from "../types";

interface SocketPayload {
  type: string;
  projectId?: string;
  data?: unknown;
}

const DiscussionThread = ({ project }: { project: Project }) => {
  const [tree, setTree] = useState<Node[]>([]);

  useEffect(() => {
    const fetchNodes = async () => {
      try {
        const res = await axiosClient.get(`/nodes/${project.id}`);
        const nodesData = res.data?.data || [];
        const rootNode: Node = {
          id: `ROOT-${project.id}`, type: "INPUT", value: project.startingValue,
          parentId: null, projectId: project.id, children: [],
          createdAt: project.createdAt, author: project.author || { username: "Anonymous" }
        };
        rootNode.children = buildTree(nodesData);
        setTree([rootNode]);
      } catch { 
        console.error("Failed to load nodes"); 
      }
    };

    fetchNodes();

    const handleUpdate = (payload: SocketPayload) => {
      if (payload.type === "NEW_REPLY" && payload.projectId === project.id) {
        fetchNodes();
      }
    };
    
    socket.on("REFRESH_FEED", handleUpdate);
    
    return () => { 
      socket.off("REFRESH_FEED", handleUpdate); 
    };
  }, [project.id, project.startingValue, project.createdAt, project.author]); 

  const handleReply = async (parentId: string, type: string, value: number) => {
    try {
      const actualParentId = parentId.startsWith("ROOT") ? null : parentId;
      await axiosClient.post("/nodes", { projectId: project.id, parentId: actualParentId, type, value });
    } catch { 
      // PERBAIKAN: Hapus (err)
      alert("Gagal reply"); 
    }
  };

  return (
    <div className="mb-8 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6">
        {tree.map((root) => (
          <CommentItem 
            key={root.id} 
            node={root} 
            onReply={handleReply} 
            parentValue={null} 
          />
        ))}
      </div>
    </div>
  );
};

export const FeedPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const { user, logout, openAuthModal } = useAuthStore();
  const [isCreating, setIsCreating] = useState(false);
  const [startVal, setStartVal] = useState("");
  const [loadingPost, setLoadingPost] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axiosClient.get("/projects");
        setProjects(res.data?.data || []);
      } catch {
        console.error("Failed to fetch projects");
      }
    };

    fetchProjects();

    const handleUpdate = (payload: SocketPayload) => {
      if (payload.type === "NEW_PROJECT") {
        fetchProjects();
      }
    };
    
    socket.on("REFRESH_FEED", handleUpdate);
    
    return () => { 
      socket.off("REFRESH_FEED", handleUpdate);
    };
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startVal) return;
    setLoadingPost(true);
    try {
      await axiosClient.post("/projects", { startingValue: Number(startVal) });
      setIsCreating(false);
      setStartVal("");
    } catch {
      alert("Gagal create"); 
    } finally { 
      setLoadingPost(false); 
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-30 bg-opacity-80 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">CalcFlow</h1>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="hidden sm:block text-right">
                  <div className="text-xs text-gray-400 font-bold uppercase">Logged in as</div>
                  <div className="text-sm font-bold text-gray-900">{user.username}</div>
                </div>
                <button onClick={logout} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors">
                  <IconLogout />
                </button>
              </>
            ) : (
              <button onClick={openAuthModal} className="text-sm font-bold text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-full transition-colors">
                Login / Register
              </button>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          {!isCreating ? (
            <button onClick={() => user ? setIsCreating(true) : openAuthModal()} className="w-full py-4 rounded-2xl border-2 border-dashed border-gray-300 text-gray-400 font-bold hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center gap-2">
              <IconPlus /> Start New Discussion
            </button>
          ) : (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100 animate-in zoom-in-95 duration-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Start a Calculation Chain</h3>
              <form onSubmit={handleCreateProject} className="flex gap-3">
                <input autoFocus type="number" placeholder="Enter starting number" className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-lg" value={startVal} disabled={loadingPost} onChange={e => setStartVal(e.target.value)} />
                <button disabled={loadingPost} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  {loadingPost ? "Posting..." : "Post"}
                </button>
                <button type="button" disabled={loadingPost} onClick={() => setIsCreating(false)} className="px-6 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-all">Cancel</button>
              </form>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {Array.isArray(projects) && projects.map((project) => (
            <DiscussionThread key={project.id} project={project} />
          ))}
          {Array.isArray(projects) && projects.length === 0 && (
            <div className="text-center py-20 animate-in fade-in zoom-in duration-500">
              <div className="text-6xl mb-4">🧮</div>
              <h3 className="text-xl font-bold text-gray-800">No discussions yet</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};