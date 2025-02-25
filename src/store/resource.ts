import { create } from "zustand";
import axios from "axios";

export interface Resource {
  id?: string;
  type: "link" | "note";
  url?: string;
  title: string;
  content?: string;
  pattern?: any;
  tags: string[];
  image?: string;
}

interface ResourceState {
  resources: Resource[];
  isLoading: boolean;
  error: string | null;
  fetchResources: () => Promise<void>;
  addResource: (resource: Omit<Resource, "id">) => Promise<void>;
  deleteResource: (id: string) => Promise<void>;
  setResources: (resources: Resource[]) => void;
  updateResource: (id: string, resource: Partial<Resource>) => Promise<void>;
}

export const useResourceStore = create<ResourceState>((set) => ({
  resources: [],
  isLoading: false,
  error: null,

  fetchResources: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get("/api/resources");
      set({ resources: response.data, isLoading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to fetch resources",
        isLoading: false,
      });
    }
  },

  addResource: async (resource) => {
    set({ isLoading: true, error: null });
    try {
      console.log("Resource Notes", resource);
      const tags = Array.isArray(resource.tags)
        ? resource.tags.filter((tag) => tag !== "")
        : [];
      const payload = { ...resource, tags };

      console.log("payload", payload);

      const response = await axios.post("/api/resources", payload);
      const newResource = response.data;

      set((state) => ({
        resources: [...state.resources, newResource],
        isLoading: false,
      }));
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to save resource",
        isLoading: false,
      });
      throw err;
    }
  },

  setResources: (resources) => set({ resources }),

  deleteResource: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`/api/resources?id=${id}`);
      set((state) => ({
        resources: state.resources.filter((resource) => resource.id !== id),
        isLoading: false,
      }));
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to delete resource",
        isLoading: false,
      });
      throw err;
    }
  },

  updateResource: async (id, resource) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.patch(`/api/resources?id=${id}`, resource);
      const updatedResource = response.data;

      set((state) => ({
        resources: state.resources.map((r) =>
          r.id === id ? { ...r, ...updatedResource } : r
        ),
        isLoading: false,
      }));
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to update resource",
        isLoading: false,
      });
      throw err;
    }
  },
}));
