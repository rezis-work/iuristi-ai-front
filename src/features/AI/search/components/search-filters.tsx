"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Slider } from "@/src/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Filter, Scale, BookOpen, Hash, BarChart3 } from "lucide-react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/src/components/ui/form";
import type { UseFormReturn } from "react-hook-form";
import { LAW_OPTIONS, TOP_K_OPTIONS } from "../constants";
import { LawType, Results, ScoreThreshold, snapLaw, snapResult, snapThreshold } from "../lib/states";

type SearchFormValues = {
  query: string;
  lawCode?: string;
  chapter?: string;
  topK: number;
  scoreThreshold: number;
};

interface SearchFiltersProps {
  form: UseFormReturn<SearchFormValues>;
}

export function SearchFilters({ form }: SearchFiltersProps) {
  const [open, setOpen] = useState(false);
  const [, setLaw] = LawType();
  const [, setResult] = Results();
  const [, setThreshold] = ScoreThreshold();

  function syncLawToUrl(lawCode: string | undefined) {
    void setLaw(snapLaw(lawCode));
  }

  function syncResultToUrl(topK: number | undefined) {
    void setResult(snapResult(topK ?? 10));
  }

  function syncThresholdToUrl(scoreThreshold: number | undefined) {
    const thresholdVal = snapThreshold(Math.round((scoreThreshold ?? 0.4) * 100));
    void setThreshold(thresholdVal);
  }

  function syncFiltersToUrl() {
    const lawCode = form.getValues("lawCode");
    const topK = form.getValues("topK");
    const scoreThreshold = form.getValues("scoreThreshold");
    syncLawToUrl(lawCode);
    syncResultToUrl(topK);
    syncThresholdToUrl(scoreThreshold);
  }

  function clearFilters() {
    form.setValue("lawCode", undefined);
    form.setValue("chapter", undefined);
    form.setValue("topK", 10);
    form.setValue("scoreThreshold", 0.4);

    syncLawToUrl(undefined);
    syncResultToUrl(10);
    syncThresholdToUrl(0.4);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="h-11 w-full rounded-xl border-zinc-700 bg-zinc-900 px-4 text-zinc-200 shadow-sm shadow-black/20 transition-all hover:border-zinc-600 hover:bg-zinc-800 hover:text-zinc-100 sm:w-auto sm:min-w-32"
        >
          <Filter className="mr-2 size-4" />
          ფილტრები
        </Button>
      </DialogTrigger>
      <DialogContent
        showCloseButton={true}
        className="max-h-[90vh] overflow-y-auto border-zinc-800 bg-zinc-950/98 p-0 shadow-2xl shadow-black/60 backdrop-blur-xl sm:max-w-xl [&>button[data-slot=dialog-close]]:right-5 [&>button[data-slot=dialog-close]]:top-5 [&>button[data-slot=dialog-close]]:text-zinc-400 [&>button[data-slot=dialog-close]]:hover:bg-zinc-800 [&>button[data-slot=dialog-close]]:hover:text-zinc-100"
      >
        <DialogHeader className="border-b border-zinc-800/80 px-6 py-5">
          <DialogTitle className="flex items-center gap-3 text-xl font-semibold text-zinc-100">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[#ff9D4D]/20">
              <Filter className="size-5 text-[#ff9D4D]" />
            </div>
            ძიების ფილტრები
          </DialogTitle>
          <p className="mt-1 text-sm text-zinc-400">
            დააზუსტე ძიების პარამეტრები უკეთესი შედეგების მისაღებად
          </p>
        </DialogHeader>

        <div className="space-y-6 px-6 py-6">
          <FormField
            control={form.control}
            name="lawCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-sm font-medium text-zinc-200">
                  <Scale className="size-4 text-zinc-500" />
                  კანონი
                </FormLabel>
                <Select
                  onValueChange={(v) => {
                    const nextLawCode = v === "__all__" ? undefined : v;
                    field.onChange(nextLawCode);
                    syncLawToUrl(nextLawCode);
                  }}
                  value={field.value ?? "__all__"}
                >
                  <FormControl>
                    <SelectTrigger className="h-11 border-zinc-700 bg-zinc-900/80 text-zinc-100 transition-colors hover:border-zinc-600 focus:ring-[#ff9D4D]/30">
                      <SelectValue placeholder="ყველა კანონი" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="border-zinc-800 bg-zinc-900">
                    {LAW_OPTIONS.map((opt) => (
                      <SelectItem
                        key={opt.value}
                        value={opt.value}
                        className="text-zinc-100 focus:bg-zinc-800 focus:text-zinc-100"
                      >
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="chapter"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-sm font-medium text-zinc-200">
                  <BookOpen className="size-4 text-zinc-500" />
                  თავი (არასავალდებულო)
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="მაგ: პირველი თავი, თავი I"
                    className="h-11 border-zinc-700 bg-zinc-900/80 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-[#ff9D4D]/30"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="topK"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-sm font-medium text-zinc-200">
                  <Hash className="size-4 text-zinc-500" />
                  შედეგების რაოდენობა
                </FormLabel>
                <Select
                  onValueChange={(v) => {
                    const nextTopK = Number(v);
                    field.onChange(nextTopK);
                    syncResultToUrl(nextTopK);
                  }}
                  value={String(field.value)}
                >
                  <FormControl>
                    <SelectTrigger className="h-11 border-zinc-700 bg-zinc-900/80 text-zinc-100 transition-colors hover:border-zinc-600 focus:ring-[#ff9D4D]/30">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="border-zinc-800 bg-zinc-900">
                    {TOP_K_OPTIONS.map((opt) => (
                      <SelectItem
                        key={opt.value}
                        value={String(opt.value)}
                        className="text-zinc-100 focus:bg-zinc-800 focus:text-zinc-100"
                      >
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="scoreThreshold"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-sm font-medium text-zinc-200">
                  <BarChart3 className="size-4 text-zinc-500" />
                  მინიმალური შესაბამისობა
                  <span className="ml-auto rounded-md bg-[#ff9D4D]/20 px-2 py-0.5 text-xs font-semibold text-[#ff9D4D]">
                    {(field.value * 100).toFixed(0)}%
                  </span>
                </FormLabel>
                <FormControl>
                  <Slider
                    min={0.2}
                    max={1}
                    step={0.05}
                    value={[field.value]}
                    onValueChange={([v]) => {
                      field.onChange(v);
                      syncThresholdToUrl(v);
                    }}
                    className="py-4 **:data-[slot=slider-range]:bg-[#ff9D4D] **:data-[slot=slider-thumb]:border-[#ff9D4D] **:data-[slot=slider-thumb]:bg-[#ff9D4D]"
                  />
                </FormControl>
                <p className="text-xs text-zinc-500">
                  მხოლოდ იმ შედეგებს გამოაჩენს, რომლების შესაბამისობაც ამ პროცენტზე მეტია
                </p>
              </FormItem>
            )}
          />
        </div>

        <div className="border-t border-zinc-800/80 px-6 py-4">
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={clearFilters}
              className="w-full border-zinc-700 bg-zinc-800 text-zinc-100 hover:bg-red-400 hover:text-white sm:w-auto sm:min-w-52"
            >
              ფილტრების გასუფთავება
            </Button>
            <Button
              type="button"
              onClick={() => {
                syncFiltersToUrl();
                setOpen(false);
              }}
              className="w-full bg-[#ff9D4D] text-white hover:bg-[#ea9753] sm:w-auto sm:min-w-40"
            >
              გამოყენება
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
