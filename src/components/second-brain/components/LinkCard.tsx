"use client";
import React from "react";
import { Tag, Link as LinkIcon } from "lucide-react";
import { FadeIn } from "@/components/ui/motion";

interface Link {
  id?: string;
  url: string;
  title: string;
  tags: string[];
}

interface LinkCardProps {
  link: Link;
}

const LinkCard: React.FC<LinkCardProps> = ({ link }) => {
  console.log("Link Card", link);
  return (
    <FadeIn className="bg-white/90 p-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 bg-blue-400 border-2 border-black rounded-lg flex items-center justify-center">
          <LinkIcon size={20} />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-xl mb-2">{link.title}</h3>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline break-all"
          >
            {link.url}
          </a>
          {link.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {link.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-300 text-sm font-bold rounded-full border-2 border-black"
                >
                  <Tag size={12} />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </FadeIn>
  );
};

export default LinkCard;
