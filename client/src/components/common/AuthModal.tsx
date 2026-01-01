import React, { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import axiosClient from "../../api/axiosClient";
import { AxiosError } from "axios";

export const AuthModal = () => {
  const { isAuthModalOpen, closeAuthModal, login } = useAuthStore();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = isLoginMode ? "/auth/login" : "/auth/register";
      const res = await axiosClient.post(endpoint, formData);
      login(res.data.user);
    } catch (err: unknown) {
      let message = "Something went wrong";
      if (err instanceof AxiosError) {
        message = err.response?.data?.message || message;
      } 
      else if (err instanceof Error) {
        message = err.message;
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800">
            {isLoginMode ? "Welcome Back!" : "Join Discussion"}
          </h2>
          <button onClick={closeAuthModal} className="text-gray-400 hover:text-gray-600 font-bold text-xl">&times;</button>
        </div>
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLoginMode && (
              <div>
                <input 
                  required
                  placeholder="Username"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                  value={formData.username}
                  onChange={e => setFormData({...formData, username: e.target.value})}
                />
              </div>
            )}

            <div>
              <input 
                required
                type="email"
                placeholder="Email Address"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div>
              <input 
                required
                type="password"
                placeholder="Password"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <button 
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all disabled:opacity-50"
            >
              {loading ? "Processing..." : (isLoginMode ? "Log In" : "Create Account")}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            <button 
              onClick={() => setIsLoginMode(!isLoginMode)} 
              className="text-blue-600 font-semibold hover:underline"
            >
              {isLoginMode ? "Need an account? Register" : "Have an account? Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};