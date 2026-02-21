import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Auth API
export const authAPI = {
  register: (data: {
    username: string;
    email: string;
    password: string;
    fullName?: string;
  }) => api.post("/auth/register", data),
  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
  updateProfile: (
    data: Partial<{ fullName: string; bio: string; avatar: string }>,
  ) => api.put("/auth/profile", data),
  logout: () => api.post("/auth/logout"),
  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append("avatar", file);
    return api.post("/auth/upload-avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

// User API
export const userAPI = {
  search: (query: string) => api.get(`/users/search?query=${query}`),
  getById: (userId: string) => api.get(`/users/${userId}`),
  getSuggested: () => api.get("/users/suggested"),
  toggleFollow: (userId: string) => api.post(`/users/${userId}/follow`),
  getOnlineStatus: (userIds: string[]) =>
    api.post("/users/online-status", { userIds }),
  updateProfile: (
    data: Partial<{ fullName: string; bio: string; avatar: string }>,
  ) => api.put("/users/profile", data),
};

// Conversation API
export const conversationAPI = {
  getAll: () => api.get("/conversations"),
  getOrCreate: (userId: string) => api.get(`/conversations/user/${userId}`),
  createGroup: (data: {
    name: string;
    participants: string[];
    avatar?: string;
  }) => api.post("/conversations/group", data),
  update: (
    conversationId: string,
    data: Partial<{ theme: string; emoji: string; isMuted: boolean }>,
  ) => api.put(`/conversations/${conversationId}`, data),
  markAsRead: (conversationId: string) =>
    api.post(`/conversations/${conversationId}/read`),
  delete: (conversationId: string) =>
    api.delete(`/conversations/${conversationId}`),
};

// Message API
export const messageAPI = {
  getMessages: (conversationId: string, page?: number, limit?: number) =>
    api.get(
      `/messages/${conversationId}?page=${page || 1}&limit=${limit || 50}`,
    ),
  send: (
    conversationId: string,
    data: {
      content: string;
      messageType?: string;
      replyTo?: string;
      mediaUrl?: string;
      duration?: number;
    },
  ) => api.post(`/messages/${conversationId}`, data),
  delete: (messageId: string) => api.delete(`/messages/${messageId}`),
  addReaction: (messageId: string, emoji: string) =>
    api.post(`/messages/${messageId}/reaction`, { emoji }),
  forward: (messageId: string, conversationIds: string[]) =>
    api.post(`/messages/${messageId}/forward`, { conversationIds }),
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/messages/upload/image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  uploadVideo: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/messages/upload/video", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  uploadAudio: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/messages/upload/audio", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

export default api;
