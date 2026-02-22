"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/src/components/ui/dialog";
import { cn } from "@/src/lib/utils";

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: React.ReactNode;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  showCloseButton?: boolean;
}

export default function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  className,
  contentClassName,
  showCloseButton = true,
}: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "bg-neutral-950 border-neutral-800 shadow-xl",
          contentClassName
        )}
        showCloseButton={showCloseButton}
      >
        {(title || description) && (
          <DialogHeader className={className}>
            {title && (
              <DialogTitle className="text-neutral-100">
                {title}
              </DialogTitle>
            )}
            {description && (
              <DialogDescription className="text-neutral-400">
                {description}
              </DialogDescription>
            )}
          </DialogHeader>
        )}
        <div className={cn("py-2", !title && !description && "pt-0")}>
          {children}
        </div>
        {footer && (
          <DialogFooter className={className}>{footer}</DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
