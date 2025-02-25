"use client";
import React from "react";
import Image from "next/image";
import { Tag, Link as LinkIcon, Trash2 } from "lucide-react";
import { FadeIn } from "@/components/ui/motion";
import { motion } from "framer-motion";

interface Resource {
  id?: string;
  type: string;
  url?: string;
  title: string;
  tags: string[];
  image?: string;
  content?: string;
  pattern?: {
    shapes: Array<{
      color: string;
      top: string;
      left: string;
      size: string;
      rotation: string;
    }>;
    backgroundColor: string;
  };
}

interface ResourceCardProps {
  resource: Resource;
  onDeleteClick: (id: string) => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onDeleteClick }) => {
  const handleClick = (e: React.MouseEvent) => {
    if (e.defaultPrevented) return;
    if (resource.type === "link" && resource.url) {
      window.open(resource.url, "_blank", "noopener,noreferrer");
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!resource.id) return;
    onDeleteClick(resource.id);
  };

  return (
    <FadeIn>
      <motion.div
        onClick={handleClick}
        className="group relative cursor-pointer bg-white p-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-300 h-[350px] flex flex-col"
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <button
          onClick={handleDelete}
          className="absolute -top-2 -right-2 w-8 h-8 bg-red-400 text-black rounded-full border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none flex items-center justify-center z-10"
        >
          <Trash2 size={14} />
        </button>

        <div className="flex-1 flex flex-col">
          <div className="relative h-48 mb-6 flex-shrink-0 overflow-hidden rounded-lg border-2 border-black">
            {resource.type === "link" ? (
              resource.image ? (
                <Image
                  src={resource.image}
                  alt={resource.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  <LinkIcon size={48} className="text-blue-400" />
                </div>
              )
            ) : (
              <div
                className="h-full relative overflow-hidden"
                style={{ backgroundColor: resource.pattern?.backgroundColor || "#FFE5E5" }}
              >
                {resource.pattern?.shapes.map((shape, index) => (
                  <div
                    key={index}
                    className="absolute transform transition-all duration-700 ease-in-out group-hover:scale-110 group-hover:rotate-12 rounded-lg"
                    style={{
                      top: shape.top,
                      left: shape.left,
                      width: shape.size,
                      height: shape.size,
                      backgroundColor: shape.color,
                      transform: `rotate(${shape.rotation}) translateZ(0)`,
                      opacity: 0.85,
                      backdropFilter: "blur(2px)",
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="flex-1 flex flex-col justify-between space-y-4">
            <h3 className="font-bold text-md line-clamp-1 group-hover:text-blue-600 transition-colors">
              {resource.title}
            </h3>

            {/* Tags Section */}
            <div className="overflow-x-auto no-scrollbar pt-2 border-t-2 border-black/10">
              <div className="flex gap-2 pb-2 min-w-fit">
                {resource.tags.length > 0 ? (
                  resource.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex flex-shrink-0 items-center gap-1 px-3 py-1.5 text-sm font-bold rounded-md border-2 border-black transition-all hover:translate-y-[-2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden"
                      style={{
                        backgroundSize: "cover",
                        backgroundImage: `url(https://api.dicebear.com/9.x/glass/svg?seed=${encodeURIComponent(
                          tag
                        )})`,
                      }}
                    >
                      <Tag size={12} />
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="inline-flex flex-shrink-0 items-center gap-1 px-3 py-1.5 bg-gray-200 text-sm font-bold text-gray-600 rounded-full border-2 border-black transition-all hover:translate-y-[-2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Tag size={12} />
                    No tags
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </FadeIn>
  );
};

export default ResourceCard;
