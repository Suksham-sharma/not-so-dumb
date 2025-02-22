import { useState, useMemo } from "react";
import { useResourceStore } from "@/store/resource";
import { toast } from "sonner";
import { toastStyles } from "@/lib/styles";

type FormType = "link" | "note" | null;

export const useSecondBrain = () => {
  const {
    resources,
    isLoading: isLoadingResources,
    error: resourcesError,
    fetchResources,
    deleteResource,
  } = useResourceStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChoiceModalOpen, setIsChoiceModalOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState<FormType>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState<string | null>(null);

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
  };
};
