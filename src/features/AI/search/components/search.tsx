"use client";

import { useForm } from "react-hook-form";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { searchRequestSchema, type SearchRequest } from "../schema/search-schema";
import { SearchFilters } from "./search-filters";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/src/components/ui/form";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/src/components/ui/empty";
import { Spinner } from "@/src/components/ui/spinner";
import { useGetCollectionStats, useSearch, useSearchSuggestions } from "../hook/search";
import type { SearchResponse } from "../api/search";
import { LawType, Results, ScoreThreshold } from "../lib/states";

export default function Search() {
  const searchParams = useSearchParams();
  const queryFromUrl = searchParams.get("query") ?? "";
  const hasRunInitialSearch = useRef(false);

  const { mutateAsync: search, isPending: isSearchPending } = useSearch();
  const { data: stats, isLoading: isStatsLoading } = useGetCollectionStats();
  const [results, setResults] = useState<SearchResponse[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);

  const [law] = LawType();
  const [result] = Results();
  const [threshold] = ScoreThreshold();

  const form = useForm<SearchRequest>({
    resolver: zodResolver(searchRequestSchema),
    defaultValues: {
      query: queryFromUrl || "",
      lawCode: law === "__all__" ? undefined : law,
      chapter: undefined,
      scoreThreshold: threshold / 100,
      topK: Number(result),
    },
  });

  useEffect(() => {
    form.reset({
      ...form.getValues(),
      lawCode: law === "__all__" ? undefined : law,
      topK: Number(result),
      scoreThreshold: threshold / 100,
    });
  }, [law, result, threshold, form]);

  useEffect(() => {
    const q = queryFromUrl.trim();
    if (q && !hasRunInitialSearch.current) {
      hasRunInitialSearch.current = true;
      form.setValue("query", q);
      const vals = form.getValues();
      search({
        query: q,
        lawCode: vals.lawCode || undefined,
        chapter: vals.chapter?.trim() || undefined,
        scoreThreshold: vals.scoreThreshold ?? threshold / 100,
        topK: vals.topK ?? Number(result),
      }).then((response) => {
        setResults(response);
        setHasSearched(true);
      });
    }
  }, [queryFromUrl, form, search, threshold, result]);

  async function onSubmit(data: SearchRequest) {
    const response = await search({
      query: data.query,
      lawCode: data.lawCode || undefined,
      chapter: data.chapter?.trim() || undefined,
      scoreThreshold: data.scoreThreshold,
      topK: data.topK,
    });
    setResults(response);
    setHasSearched(true);
  }

  return (
    <section className="mx-auto w-full py-20 max-w-[1100px] px-3 pb-6 pt-[84px] sm:px-5 sm:pt-[96px] lg:px-8 lg:pt-[100px] ">
      <div className="space-y-5">
        <Card className="overflow-hidden rounded-3xl border-zinc-800/90 bg-zinc-950/90 text-zinc-100 shadow-2xl shadow-black/40 backdrop-blur">
          <CardHeader className="gap-4 border-b border-zinc-800/90">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-1">
                <CardTitle className="text-xl font-semibold">იურიდიული ძიება AI-ით</CardTitle>
                <p className="text-sm text-zinc-400">
                  მოძებნე შესაბამისი ნორმები, მუხლები და წყაროები ბუნებრივი ენით.
                </p>
              </div>
              {isStatsLoading ? (
                <div className="inline-flex items-center gap-2 text-sm text-zinc-400">
                  <Spinner />
                  ბაზის სტატუსი იტვირთება...
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="bg-zinc-800 text-zinc-100">
                    ჩანაწერები: {stats?.pointsCount ?? 0}
                  </Badge>
                  <Badge variant="outline" className="border-zinc-700 text-zinc-200">
                    ინდექსირებული ვექტორები: {stats?.indexedVectorsCount ?? 0}
                  </Badge>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <FormField
                control={form.control}
                name="query"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-zinc-200">საძიებო მოთხოვნა</FormLabel>
                    <FormControl>
                      <Popover open={suggestionsOpen} onOpenChange={setSuggestionsOpen}>
                        <PopoverAnchor asChild>
                          <div className="relative">
                            <Input
                              placeholder="მაგალითი: შრომითი ხელშეკრულების შეწყვეტის საფუძვლები"
                              disabled={isSearchPending}
                              className="border-zinc-700 bg-zinc-900 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-zinc-500/60"
                              {...field}
                              onFocus={() => queryValue && setSuggestionsOpen(true)}
                              onBlur={() => setTimeout(() => setSuggestionsOpen(false), 150)}
                              onChange={(e) => {
                                field.onChange(e);
                                setSuggestionsOpen(true);
                              }}
                            />
                          </div>
                        </PopoverAnchor>
                        <PopoverContent
                          className="w-(--radix-popover-trigger-width) max-h-[280px] overflow-y-auto p-0 border-zinc-800 bg-zinc-950"
                          align="start"
                          sideOffset={4}
                        >
                          {isSuggestionsLoading ? (
                            <div className="flex items-center justify-center gap-2 p-4 text-sm text-zinc-400">
                              <Spinner className="size-4" />
                              იტვირთება...
                            </div>
                          ) : suggestions.length > 0 ? (
                            <ul className="py-1">
                              {suggestions.map((item) => (
                                <li key={item.id}>
                                  <button
                                    type="button"
                                    className="w-full px-3 py-2.5 text-left text-sm text-zinc-200 hover:bg-zinc-800/80 transition-colors"
                                    onMouseDown={(e) => {
                                      e.preventDefault();
                                      form.setValue("query", item.text.slice(0, 150));
                                      setSuggestionsOpen(false);
                                    }}
                                  >
                                    <span className="line-clamp-2">{item.text}</span>
                                    {item.lawTitle && (
                                      <span className="mt-1 block text-xs text-zinc-500">{item.lawTitle}</span>
                                    )}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          ) : debouncedQuery.trim().length >= 1 ? (
                            <div className="p-4 text-sm text-zinc-400">შედეგი ვერ მოიძებნა</div>
                          ) : null}
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <SearchFilters form={form} />
              <Button
                type="submit"
                disabled={isSearchPending}
                className="self-end bg-[#ff9D4D] text-white hover:bg-[#ea9753] sm:min-w-32"
              >
                {isSearchPending ? (
                  <>
                    <Spinner />
                    ვეძებ...
                  </>
                ) : (
                  "ძებნა"
                )}
              </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {!hasSearched && (
          <Card className="rounded-2xl border-zinc-800/90 bg-zinc-950/80 text-zinc-100">
            <CardContent className="pt-6">
              <Empty className="border-zinc-800/80 text-zinc-100">
                <EmptyHeader>
                  <EmptyTitle>მზად ვარ ძიებისთვის</EmptyTitle>
                  <EmptyDescription className="text-zinc-400">
                    ჩაწერე შეკითხვა მარტივი ენით. მაგალითად: „რა შემთხვევაში შეიძლება ხელშეკრულების
                    ცალმხრივად შეწყვეტა?“
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            </CardContent>
          </Card>
        )}

        {hasSearched && results.length === 0 && !isSearchPending && (
          <Card className="rounded-2xl border-zinc-800/90 bg-zinc-950/80 text-zinc-100">
            <CardContent className="pt-6">
              <Empty className="border-zinc-800/80 text-zinc-100">
                <EmptyHeader>
                  <EmptyTitle>ამ მოთხოვნაზე შედეგი ვერ მოიძებნა</EmptyTitle>
                  <EmptyDescription className="text-zinc-400">
                    სცადე უფრო ზოგადი ფორმულირება, სხვა საკვანძო სიტყვა ან თემის დაზუსტება.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            </CardContent>
          </Card>
        )}

        {results.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-zinc-300">
                ნაპოვნია {results.length} შედეგი
              </h2>
            </div>
            {results.map((item) => (
              <Card
                key={item.id}
                className="rounded-2xl border-zinc-800/90 bg-zinc-950/85 text-zinc-100 shadow-lg shadow-black/20"
              >
                <CardHeader className="gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className="bg-blue-600 text-white hover:bg-blue-600">{item.lawTitle}</Badge>
                    {item.articleNumber && (
                      <Badge variant="outline" className="border-zinc-700 text-zinc-200">
                        მუხლი: {item.articleNumber}
                      </Badge>
                    )}
                    {item.chapter && (
                      <Badge variant="secondary" className="bg-zinc-800 text-zinc-100">
                        {item.chapter}
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-zinc-400">
                    შესაბამისობის დონე: {(item.score * 100).toFixed(1)}%
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm leading-6 text-zinc-200">{item.text}</p>
                  {item.sourceUrl && (
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex text-sm text-blue-400 underline underline-offset-4 hover:text-blue-300"
                    >
                      იხილე ოფიციალური წყარო
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
