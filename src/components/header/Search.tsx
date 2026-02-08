"use client";

import { useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { X, Search as Search2 } from "lucide-react";
import Wrapper from "@/src/components/shared/wrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Logo } from "@/src/components/header/Logo";

const formSchema = z.object({
  search: z.string().min(1, "Please enter a search term"),
});

interface SearchProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export function Search({ isOpen, onClose }: SearchProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Search submitted:", values);
    form.reset();
  }

  const handleClose = useCallback(() => {
    form.reset();
    onClose();
  }, [form, onClose]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, handleClose]);

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.19, 1.0, 0.22, 1.0] }}
            className="fixed inset-0 bg-linear-to-b from-black via-black/5 to-transparent z-40"
            onClick={handleClose}
          />
          <motion.div
            key="desktop-search"
            initial={{ y: "-100%", opacity: 0 }}
            animate={{
              y: 0,
              opacity: 1,
              transition: {
                type: "spring",
                damping: 30,
                stiffness: 300,
                mass: 0.8,
              },
            }}
            exit={{
              y: "-100%",
              opacity: 0,
              transition: {
                duration: 0.3,
                ease: [0.76, 0, 0.24, 1],
              },
            }}
            className="absolute top-full left-0 w-full z-50 -mt-23"
          >
            <div
              className={`backdrop-blur-xl bg-black border-b h-80 lg:h-112 border-zinc-800/80 shadow-[0_20px_60px_rgba(0,0,0,0.65)]`}
            >
              <Wrapper className="mx-auto px-4">
                <div className="flex items-center justify-between bg-black">
                  <Logo />
                  <button
                    onClick={handleClose}
                    className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    aria-label="Close search"
                  >
                    <X className="w-7 h-7" />
                  </button>
                </div>
              </Wrapper>
              <Wrapper className="mx-auto px-4 sm:px-10 lg:px-40">
                <motion.div className={`py-17 lg:py-32`}>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="flex-1"
                    >
                      <FormField
                        control={form.control}
                        name="search"
                        render={({ field }) => (
                          <FormItem className="relative">
                            <motion.div
                              initial={{ scaleX: 0 }}
                              animate={{
                                scaleX: 1,
                                transition: {
                                  delay: 0.3,
                                  duration: 0.5,
                                  ease: [0.19, 1.0, 0.22, 1.0],
                                },
                              }}
                              className="absolute inset-0 pointer-events-none origin-left"
                            />
                            <FormControl>
                              <div className="relative py-3">
                                <Input
                                  {...field}
                                  autoFocus
                                  type="text"
                                  placeholder="Search across pages, services, and resources..."
                                  className="h-10 w-full bg-black border-none rounded-none pl-4 pr-12 text-xs md:text-sm font-medium text-neutral-100 placeholder:text-neutral-600 focus-visible:ring-0 focus-visible:ring-offset-0 keep-bg"
                                  style={{
                                    boxShadow: "inset 0 0 0 1000px #000000",
                                  }}
                                />
                                <Search2
                                  onClick={() => form.handleSubmit(onSubmit)()}
                                  className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                                />
                                <motion.div
                                  initial={{ scaleX: 0 }}
                                  animate={{
                                    scaleX: 1,
                                    transition: {
                                      delay: 0.4,
                                      duration: 0.8,
                                      ease: [0.19, 1.0, 0.22, 1.0],
                                    },
                                  }}
                                  className="absolute bottom-0 left-0 w-full h-px bg-zinc-700 origin-left"
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="absolute -bottom-6 left-0 text-xs text-red-400" />
                          </FormItem>
                        )}
                      />
                    </form>
                  </Form>
                </motion.div>
              </Wrapper>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
