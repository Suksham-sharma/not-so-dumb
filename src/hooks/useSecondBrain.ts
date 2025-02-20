import { useState, useMemo } from "react";
import { useLinksStore } from "@/store/links";
import { toast } from "sonner";
import { toastStyles } from "@/lib/styles";

type FormType = "link" | "note" | null;

export const useSecondBrain = () => {
  const {
    links,
    isLoading: isLoadingLinks,
    error: linksError,
    fetchLinks,
    deleteLink,
  } = useLinksStore();

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
      await deleteLink(linkToDelete);
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
    links?.forEach((link) => {
      link.tags.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet);
  }, [links]);

  const filteredLinks = useMemo(() => {
    return links.filter((link) => {
      const matchesSearch = searchTerm
        ? link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          link.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
          link.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : true;

      const matchesTag = selectedTag
        ? link.tags.some((tag) => tag === selectedTag)
        : true;

      return matchesSearch && matchesTag;
    });
  }, [links, searchTerm, selectedTag]);

  return {
    links,
    isLoadingLinks,
    linksError,
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
    handleDeleteClick,
    handleConfirmDelete,
    handleSubmit,
    availableTags,
    filteredLinks,
  };
};