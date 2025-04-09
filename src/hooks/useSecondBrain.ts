import { useState, useMemo, useEffect } from "react";
import { useResourceStore } from "@/store/resource";
import { toast } from "sonner";
import { toastStyles } from "@/lib/styles";

type FormType = "link" | "note" | null;

interface BrainChatResponse {
  answer: string;
  sources: Array<{
    title: string;
    type: string;
    url?: string;
  }>;
}

export const useSecondBrain = () => {
  const {
    resources,
    isLoading: isLoadingResources,
    error: resourcesError,
    fetchResources,
    deleteResource,
  } = useResourceStore();

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChoiceModalOpen, setIsChoiceModalOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState<FormType>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState<string | null>(null);
  const [isBrainChatOpen, setIsBrainChatOpen] = useState(false);
  const [brainChatQuery, setBrainChatQuery] = useState("");
  const [selectedResourceIds, setSelectedResourceIds] = useState<string[]>([]);
  const [isLoadingBrainChat, setIsLoadingBrainChat] = useState(false);
  const [brainChatResponse, setBrainChatResponse] =
    useState<BrainChatResponse | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(false);
  };

  const handleDeleteClick = (id: string) => {
    setLinkToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!linkToDelete) return;
    try {
      setIsDeleting(true);
      await deleteResource(linkToDelete);
      toast.success("Resource deleted successfully", {
        className: toastStyles.success,
        duration: 3000,
        position: "bottom-right",
      });
    } catch (error) {
      console.error("Error deleting resource:", error);
      toast.error("Failed to delete resource", {
        className: toastStyles.error,
        duration: 3000,
        position: "bottom-right",
      });
    } finally {
      setDeleteModalOpen(false);
      setLinkToDelete(null);
      setIsDeleting(false);
    }
  };

  const handleBrainChat = async (query: string) => {
    if (!query.trim()) return;

    setIsLoadingBrainChat(true);
    try {
      const response = await fetch("/api/brain-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          resourceIds: selectedResourceIds,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Brain chat error response:", errorData);
        throw new Error(errorData.error || "Failed to get brain chat response");
      }

      const data = await response.json();
      setBrainChatResponse(data);
    } catch (error) {
      console.error("Error in brain chat:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to get brain chat response",
        {
          className: toastStyles.error,
          duration: 3000,
          position: "bottom-right",
        }
      );
    } finally {
      setIsLoadingBrainChat(false);
    }
  };

  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    resources?.forEach((resource) => {
      resource.tags.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet);
  }, [resources]);

  const filteredResources = useMemo(() => {
    console.log("resources", resources);
    return resources.filter((resource) => {
      const matchesSearch = searchTerm
        ? resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          resource.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : true;

      const matchesTag = selectedTag
        ? resource.tags.some((tag) => tag === selectedTag)
        : true;

      return matchesSearch && matchesTag;
    });
  }, [resources, searchTerm, selectedTag]);

  return {
    resources,
    isLoadingResources,
    resourcesError,
    searchTerm,
    setSearchTerm,
    selectedTag,
    setSelectedTag,
    isModalOpen,
    setIsModalOpen,
    isChoiceModalOpen,
    setIsChoiceModalOpen,
    selectedForm,
    setSelectedForm,
    deleteModalOpen,
    setDeleteModalOpen,
    setLinkToDelete,
    handleDeleteClick,
    handleConfirmDelete,
    handleSubmit,
    availableTags,
    filteredResources,
    isDeleting,
    // Brain Chat
    isBrainChatOpen,
    setIsBrainChatOpen,
    brainChatQuery,
    setBrainChatQuery,
    selectedResourceIds,
    setSelectedResourceIds,
    isLoadingBrainChat,
    brainChatResponse,
    handleBrainChat,
  };
};
