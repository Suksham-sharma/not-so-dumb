"use client";

import React from "react";
import { toast as sonnerToast } from "sonner";
import { cn } from "@/lib/utils";

export type ToastVariant = "default" | "success" | "error";

export interface ToastProps {
  id: string | number;
  title: string;
  description?: string;
  variant?: ToastVariant;
  button?: {
    label: string;
    onClick: () => void;
  };
}

const variantStyles = {
  default: "bg-white",
  success: "bg-green-100",
  error: "bg-red-100",
} as const;

function Toast(props: ToastProps) {
  const { title, description, button, id, variant = "default" } = props;

  return (
    <div
      className={cn(
        "flex w-full md:max-w-[364px] items-center p-4 rounded-xl",
        "border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
        "transform transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
        variantStyles[variant]
      )}
    >
      <div className="flex flex-1 items-center">
        <div className="w-full">
          <p className="text-sm font-bold text-black">{title}</p>
          {description && (
            <p className="mt-1 text-sm text-black/80">{description}</p>
          )}
        </div>
      </div>
      {button && (
        <div className="ml-5 shrink-0">
          <button
            className={cn(
              "px-4 py-2 text-sm font-bold text-black rounded-lg",
              "border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
              "transform transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none",
              "bg-orange-400 hover:bg-orange-500"
            )}
            onClick={() => {
              button.onClick();
              sonnerToast.dismiss(id);
            }}
          >
            {button.label}
          </button>
        </div>
      )}
    </div>
  );
}

export type ToastOptions = Omit<ToastProps, "id">;

export function toast(options: ToastOptions) {
  return sonnerToast.custom((id) => (
    <Toast
      id={id}
      title={options.title}
      description={options.description}
      variant={options.variant}
      button={options.button}
    />
  ));
}

/** Example usage component */
export function ToastDemo() {
  const showSuccessToast = () => {
    toast({
      title: "Success!",
      description: "Your action was completed successfully.",
      variant: "success",
      button: {
        label: "Dismiss",
        onClick: () => sonnerToast.dismiss(),
      },
    });
  };

  const showErrorToast = () => {
    toast({
      title: "Error!",
      description: "Something went wrong. Please try again.",
      variant: "error",
      button: {
        label: "Retry",
        onClick: () => console.log("Retrying..."),
      },
    });
  };

  return (
    <div className="flex gap-4">
      <button
        className="px-4 py-2 text-sm font-bold text-black rounded-lg bg-green-100 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
        onClick={showSuccessToast}
      >
        Show Success Toast
      </button>
      <button
        className="px-4 py-2 text-sm font-bold text-black rounded-lg bg-red-100 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
        onClick={showErrorToast}
      >
        Show Error Toast
      </button>
    </div>
  );
}
