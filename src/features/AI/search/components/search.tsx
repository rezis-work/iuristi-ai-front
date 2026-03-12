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
import { useGetCollectionStats, useSearch } from "../hook/search";
import type { SearchResponse } from "../api/search";
import { LawType, Results } from "../lib/states";

export default function Search() {
  const searchParams = useSearchParams();
  const queryFromUrl = searchParams.get("query") ?? "";
  const hasRunInitialSearch = useRef(false);

  const { mutateAsync: search, isPending: isSearchPending } = useSearch();
  const { data: stats, isLoading: isStatsLoading } = useGetCollectionStats();
  const [results, setResults] = useState<SearchResponse[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const [law] = LawType();
  const [result] = Results();

  const form = useForm<SearchRequest>({
    resolver: zodResolver(searchRequestSchema),
    defaultValues: {
      query: queryFromUrl || "",
      lawCode: law === "__all__" ? undefined : law,
      chapter: undefined,
      topK: Number(result),
    },
  });

  useEffect(() => {
    form.reset({
      ...form.getValues(),
      lawCode: law === "__all__" ? undefined : law,
      topK: Number(result),
    });
  }, [law, result, form]);

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
        topK: vals.topK ?? Number(result),
      }).then((response) => {
        setResults(response);
        setHasSearched(true);
      });
    }
  }, [queryFromUrl, form, search, result]);

  async function onSubmit(data: SearchRequest) {
    const response = await search({
      query: data.query,
      lawCode: data.lawCode || undefined,
      chapter: data.chapter?.trim() || undefined,
      topK: data.topK,
    });
    setResults(response);
    setHasSearched(true);
  }

  return (
    <section className="mx-auto w-full max-w-[1120px] px-3 pb-10 pt-[84px] sm:px-5 sm:pt-[96px] lg:px-8 lg:pt-[100px]">
      <div className="space-y-7">
        <Card className="overflow-hidden rounded-3xl border-zinc-800/80 bg-zinc-950 text-zinc-100 shadow-lg shadow-black/15">
          <CardHeader className="gap-3 border-b border-zinc-800/70 pb-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-2xl space-y-2">
                <Badge className="w-fit border-zinc-700 bg-zinc-900/80 text-zinc-200 hover:bg-zinc-900">
                  AI Legal Search
                </Badge>
                <CardTitle className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  იურიდიული ძიება AI-ით
                </CardTitle>
                <p className="max-w-xl text-sm leading-6 text-zinc-400 sm:text-base">
                  მოძებნე შესაბამისი ნორმები, მუხლები და წყაროები ბუნებრივი ენით, სწრაფად და ზუსტად.
                </p>
              </div>
              {isStatsLoading ? (
                <div className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/80 px-3 py-2 text-sm text-zinc-400">
                  <Spinner />
                  ბაზის სტატუსი იტვირთება...
                </div>
              ) : (
                <div className="grid w-full max-w-sm grid-cols-2 gap-2 sm:w-auto">
                  <div className="rounded-xl border border-zinc-800 bg-zinc-900/75 px-3 py-2.5">
                    <p className="text-xs text-zinc-500">ჩანაწერები</p>
                    <p className="text-lg font-semibold text-zinc-100">{stats?.pointsCount ?? 0}</p>
                  </div>
                  <div className="rounded-xl border border-zinc-800 bg-zinc-900/75 px-3 py-2.5">
                    <p className="text-xs text-zinc-500">ინდექსირებული ვექტორები</p>
                    <p className="text-lg font-semibold text-zinc-100">{stats?.indexedVectorsCount ?? 0}</p>
                  </div>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/70 p-4 sm:p-5">
                  <FormField
                    control={form.control}
                    name="query"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-200">საძიებო მოთხოვნა</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="მაგალითი: შრომითი ხელშეკრულების შეწყვეტის საფუძვლები"
                            disabled={isSearchPending}
                            className="h-12 rounded-xl border-zinc-700 bg-zinc-900 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-zinc-500/50"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <SearchFilters form={form} />
                    <Button
                      type="submit"
                      disabled={isSearchPending}
                      className="h-11 w-full rounded-xl bg-zinc-100 px-5 font-medium text-zinc-950 shadow-sm shadow-black/20 transition-all hover:bg-zinc-200 sm:w-auto sm:min-w-36"
                    >
                      {isSearchPending ? (
                        <>
                          <Spinner />
                          ვეძებ...
                        </>
                      ) : (
                        "ძიების დაწყება"
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {!hasSearched && (
          <Card className="rounded-2xl border-zinc-800/80 bg-zinc-950/70 text-zinc-100">
            <CardContent className="pt-6">
              <Empty className="rounded-2xl border-zinc-800/80 bg-zinc-900/40 text-zinc-100">
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
          <Card className="rounded-2xl border-zinc-800/80 bg-zinc-950/70 text-zinc-100">
            <CardContent className="pt-6">
              <Empty className="rounded-2xl border-zinc-800/80 bg-zinc-900/40 text-zinc-100">
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
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-sm font-medium text-zinc-300">ნაპოვნია {results.length} შედეგი</h2>
              <Badge variant="outline" className="border-zinc-700 bg-zinc-900/70 text-zinc-200">
                დალაგება: შესაბამისობით
              </Badge>
            </div>
            {results.map((item) => (
              <Card
                key={item.id}
                className="group rounded-2xl border-zinc-800/80 bg-zinc-950 text-zinc-100 transition-all duration-200 hover:-translate-y-0.5 hover:border-zinc-700 hover:shadow-lg hover:shadow-black/20"
              >
                <CardHeader className="gap-3 pb-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className="bg-zinc-800 text-zinc-100 hover:bg-zinc-800">{item.lawTitle}</Badge>
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
                  <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
                    <div
                      className="h-full rounded-full bg-zinc-400"
                      style={{ width: `${Math.min(Math.max(item.score * 100, 0), 100)}%` }}
                    />
                  </div>
                  <div className="text-sm text-zinc-400">
                    შესაბამისობის დონე:{" "}
                    <span className="font-medium text-zinc-200">{(item.score * 100).toFixed(1)}%</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm leading-7 text-zinc-200">{item.text}</p>
                  {item.sourceUrl && (
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center text-sm font-medium text-zinc-300 underline underline-offset-4 transition-colors hover:text-zinc-100"
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
