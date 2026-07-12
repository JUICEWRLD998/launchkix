"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { Button, type ButtonProps } from "./Button";
import { useToastContext } from "@/components/providers/ToastProvider";

export interface CopyButtonProps extends Omit<ButtonProps, "onClick" | "children"> {
  /** Text to copy to clipboard */
  value: string;
  /** Success message (default: "Copied to clipboard") */
  successMessage?: string;
  children?: ReactNode;
}

export function CopyButton({
  value,
  successMessage = "Copied to clipboard",
  children = "Copy",
  variant = "secondary",
  size = "sm",
  ...props
}: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false);
  const { success, error } = useToastContext();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setIsCopied(true);
      success(successMessage);

      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      error("Failed to copy", "Please try again");
      console.error("Copy failed:", err);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleCopy}
      aria-label={isCopied ? "Copied" : "Copy to clipboard"}
      {...props}
    >
      {isCopied ? (
        <>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M13 4L6 11L3 8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <rect
              x="5"
              y="5"
              width="9"
              height="9"
              rx="1.5"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M3 10.5V3.5C3 2.67157 3.67157 2 4.5 2H10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          {children}
        </>
      )}
    </Button>
  );
}
