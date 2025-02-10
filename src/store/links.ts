import { create } from "zustand";
import axios from "axios";

export interface Link {
  id?: string;
  url: string;
  title: string;
  tags: string[];
  image?: string;
}

interface LinksState {
  links: Link[];
  isLoading: boolean;
  error: string | null;
  fetchLinks: () => Promise<void>;
  addLink: (link: Omit<Link, "id">) => Promise<void>;
  setLinks: (links: Link[]) => void;
}

export const useLinksStore = create<LinksState>((set) => ({
  links: [],
  isLoading: false,
  error: null,

  fetchLinks: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get("/api/resources");
      set({ links: response.data, isLoading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to fetch links",
        isLoading: false,
      });
    }
  },

  addLink: async (link) => {
    set({ isLoading: true, error: null });
    try {
      const tags = Array.isArray(link.tags)
        ? link.tags.filter((tag) => tag !== "")
        : [];
      const payload = { ...link, tags };

      const response = await axios.post("/api/resources", payload);
      const newLink = response.data;

      set((state) => ({
        links: [...state.links, newLink],
        isLoading: false,
      }));
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to save link",
        isLoading: false,
      });
      throw err;
    }
  },

  setLinks: (links) => set({ links }),
}));
