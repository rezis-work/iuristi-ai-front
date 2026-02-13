"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { formatDistanceToNow } from "date-fns";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  XCircle,
  Search,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";
import { useListInvites, useRevokeInvite } from "../hooks/use-invites";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import type { InviteStatus, InviteListItem } from "../api/invites";
import { Input } from "@/src/components/ui/input";
import { Form, FormControl, FormField, FormItem } from "@/src/components/ui/form";
import { UnderlinedFieldWrapper } from "@/src/components/shared/UnderlinedFieldWrapper";

interface InvitesListProps {
  orgId: string | null;
}

const getStatusColor = (status: InviteStatus) => {
  switch (status) {
    case "pending":
      return "bg-amber-500/10 text-amber-300 border border-amber-500/30";
    case "accepted":
      return "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30";
    case "revoked":
      return "bg-rose-500/10 text-rose-300 border border-rose-500/30";
    case "expired":
      return "bg-zinc-500/10 text-zinc-300 border border-zinc-500/30";
    default:
      return "bg-zinc-500/10 text-zinc-300 border border-zinc-500/30";
  }
};

export function InvitesList({ orgId }: InvitesListProps) {
  const { data: invites, isLoading, error } = useListInvites(orgId);
  const revokeInviteMutation = useRevokeInvite(orgId);

  const [globalFilter, setGlobalFilter] = useState("");
  const form = useForm<{ search: string }>({
    defaultValues: {
      search: "",
    },
  });

  useEffect(() => {
    form.setValue("search", globalFilter);
  }, [globalFilter, form]);

  const handleRevoke = (inviteId: string) => {
    if (confirm("Are you sure you want to revoke this invite?")) {
      revokeInviteMutation.mutate(inviteId);
    }
  };

  const columns = useMemo<ColumnDef<InviteListItem>[]>(
    () => [
      {
        accessorKey: "email",
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 px-2 text-xs rounded-none font-medium uppercase tracking-wide text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }
          >
            <span className="flex items-center gap-1">
              Email
              {column.getIsSorted() === "asc" ? (
                <ArrowUp className="h-3 w-3" />
              ) : column.getIsSorted() === "desc" ? (
                <ArrowDown className="h-3 w-3" />
              ) : (
                <ArrowUpDown className="h-3 w-3 opacity-40" />
              )}
            </span>
          </Button>
        ),
        cell: ({ row }) => (
          <div className="font-medium text-zinc-100">
            {row.getValue("email")}
          </div>
        ),
      },
      {
        accessorKey: "role",
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 px-2 text-xs font-medium uppercase tracking-wide text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }
          >
            <span className="flex items-center gap-1">
              Role
              {column.getIsSorted() === "asc" ? (
                <ArrowUp className="h-3 w-3" />
              ) : column.getIsSorted() === "desc" ? (
                <ArrowDown className="h-3 w-3" />
              ) : (
                <ArrowUpDown className="h-3 w-3 opacity-40" />
              )}
            </span>
          </Button>
        ),
        cell: ({ row }) => (
          <div className="capitalize text-sm text-zinc-200">
            {row.getValue("role")}
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: () => (
          <span className="text-xs font-medium uppercase tracking-wide text-zinc-400">
            Status
          </span>
        ),
        cell: ({ row }) => {
          const status = row.getValue("status") as InviteStatus;
          return (
            <Badge
              variant="outline"
              className={`rounded-none px-2.5 py-1 text-[11px] font-medium leading-none ${getStatusColor(
                status,
              )}`}
            >
              {status}
            </Badge>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 px-2 text-xs font-medium uppercase tracking-wide text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }
          >
            <span className="flex items-center gap-1">
              Created
              {column.getIsSorted() === "asc" ? (
                <ArrowUp className="h-3 w-3" />
              ) : column.getIsSorted() === "desc" ? (
                <ArrowDown className="h-3 w-3" />
              ) : (
                <ArrowUpDown className="h-3 w-3 opacity-40" />
              )}
            </span>
          </Button>
        ),
        cell: ({ row }) => {
          const date = new Date(row.getValue("createdAt"));
          return (
            <div className="text-xs text-zinc-400">
              {formatDistanceToNow(date, { addSuffix: true })}
            </div>
          );
        },
      },
      {
        accessorKey: "expiresAt",
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 px-2 text-xs font-medium uppercase tracking-wide text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }
          >
            <span className="flex items-center gap-1">
              Expires
              {column.getIsSorted() === "asc" ? (
                <ArrowUp className="h-3 w-3" />
              ) : column.getIsSorted() === "desc" ? (
                <ArrowDown className="h-3 w-3" />
              ) : (
                <ArrowUpDown className="h-3 w-3 opacity-40" />
              )}
            </span>
          </Button>
        ),
        cell: ({ row }) => {
          const date = new Date(row.getValue("expiresAt"));
          return (
            <div className="text-xs text-zinc-400">
              {formatDistanceToNow(date, { addSuffix: true })}
            </div>
          );
        },
      },
      {
        accessorKey: "acceptedAt",
        header: () => (
          <span className="text-xs font-medium uppercase tracking-wide text-zinc-400">
            Accepted
          </span>
        ),
        cell: ({ row }) => {
          const acceptedAt = row.getValue("acceptedAt") as string | null;
          return (
            <div className="text-xs text-zinc-300">
              {acceptedAt ? (
                formatDistanceToNow(new Date(acceptedAt), { addSuffix: true })
              ) : (
                <span className="text-zinc-500">—</span>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "revokedAt",
        header: () => (
          <span className="text-xs font-medium uppercase tracking-wide text-zinc-400">
            Revoked
          </span>
        ),
        cell: ({ row }) => {
          const revokedAt = row.getValue("revokedAt") as string | null;
          return (
            <div className="text-xs text-zinc-300">
              {revokedAt ? (
                formatDistanceToNow(new Date(revokedAt), { addSuffix: true })
              ) : (
                <span className="text-zinc-500">—</span>
              )}
            </div>
          );
        },
      },
      {
        id: "actions",
        header: () => (
          <span className="text-xs font-medium uppercase tracking-wide text-zinc-400">
            Actions
          </span>
        ),
        cell: ({ row }) => {
          const invite = row.original;
          if (invite.status !== "pending") {
            return null;
          }
          return (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full border border-rose-500/40 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 hover:text-rose-100"
              onClick={() => handleRevoke(invite.id)}
              disabled={revokeInviteMutation.isPending}
              title="Revoke invite"
            >
              <XCircle className="h-3.5 w-3.5" />
            </Button>
          );
        },
      },
    ],
    [revokeInviteMutation.isPending],
  );

  const table = useReactTable({
    data: invites || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(), // enables filtering pipeline[web:80]
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "auto", // text-style includes filter[web:87]
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 4,
      },
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
        <div className="h-5 w-32 animate-pulse rounded-full bg-zinc-800/80" />
        <div className="h-9 w-full animate-pulse rounded-lg bg-zinc-900" />
        <div className="h-9 w-full animate-pulse rounded-lg bg-zinc-900" />
        <div className="h-9 w-full animate-pulse rounded-lg bg-zinc-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-rose-500/40 bg-rose-500/5 px-4 py-3 text-sm text-rose-200">
        <XCircle className="h-4 w-4" />
        <span>Failed to load invites. Please try again.</span>
      </div>
    );
  }

  if (!invites || invites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950/60 px-6 py-10 text-center">
        <p className="text-sm font-medium text-zinc-100">No invites yet</p>
        <p className="text-xs text-zinc-500">
          Create an invite above to start collaborating with your team.
        </p>
      </div>
    );
  }

  const page = table.getState().pagination.pageIndex + 1;
  const pageCount = table.getPageCount();

  return (
    <div className="w-full overflow-x-hidden rounded-none border border-zinc-800 bg-zinc-950/60">
      {/* Search bar */}
      <div className="flex items-center gap-2 border-b border-zinc-800 px-3 py-2.5">
        <Form {...form}>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="w-full"
          >
            <FormField
              control={form.control}
              name="search"
              render={({ field, fieldState }) => (
                <FormItem className="relative w-full max-w-xs">                 
                 <FormControl>
<UnderlinedFieldWrapper
                                  icon={<Search className="w-4 h-4" />}
                                  error={!!fieldState.error}
                                >
                                  <Input
                                    {...field}
                                    value={field.value ?? ""}
                                    onChange={(e) => {
                                      field.onChange(e);
                                      table.setGlobalFilter(e.target.value);
                                    }}
                                    placeholder="Search invites (email, role, status)..."
                                    autoComplete="given-name"
                                    className="h-10 w-full bg-transparent border-none rounded-none px-0 pr-7 text-xs md:text-sm font-medium text-neutral-100 placeholder:text-neutral-600 focus-visible:ring-0 focus-visible:ring-offset-0 keep-bg"
                                  />
                                </UnderlinedFieldWrapper>
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>

      {/* Desktop table (large screens) */}
      <Table className="table-fixed w-full hidden lg:table">
        <TableHeader className="bg-zinc-950/80">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="border-zinc-800/80 hover:bg-transparent"
            >
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="px-3 py-2.5 text-xs text-zinc-400"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row, idx) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className={`border-zinc-900/80 transition-colors hover:bg-zinc-900/60 ${
                  idx % 2 === 1 ? "bg-zinc-950/60" : ""
                }`}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className="max-w-[220px] truncate px-3 py-2.5 align-middle text-sm text-zinc-200"
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext(),
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-sm text-zinc-500"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Cards layout for small & medium screens */}
      <div className="lg:hidden divide-y divide-zinc-900">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => {
            const invite = row.original as InviteListItem;
            const createdLabel = invite.createdAt
              ? formatDistanceToNow(new Date(invite.createdAt), {
                  addSuffix: true,
                })
              : "—";
            const expiresLabel = invite.expiresAt
              ? formatDistanceToNow(new Date(invite.expiresAt), {
                  addSuffix: true,
                })
              : "—";
            const acceptedLabel = invite.acceptedAt
              ? formatDistanceToNow(new Date(invite.acceptedAt), {
                  addSuffix: true,
                })
              : "—";
            const revokedLabel = invite.revokedAt
              ? formatDistanceToNow(new Date(invite.revokedAt), {
                  addSuffix: true,
                })
              : "—";

            return (
              <div
                key={row.id}
                className="px-3 py-3 flex flex-col gap-2.5 bg-zinc-950/60"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-zinc-100">
                      {invite.email}
                    </p>
                    <p className="mt-0.5 text-[11px] uppercase tracking-wide text-zinc-500">
                      {invite.role}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={`rounded-none px-2 py-0.5 text-[10px] font-medium ${getStatusColor(
                      invite.status,
                    )}`}
                  >
                    {invite.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-zinc-400">
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-zinc-500">Created</span>
                    <span className="text-right text-zinc-300">
                      {createdLabel}
                    </span>
                  </span>
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-zinc-500">Expires</span>
                    <span className="text-right text-zinc-300">
                      {expiresLabel}
                    </span>
                  </span>
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-zinc-500">Accepted</span>
                    <span className="text-right text-zinc-300">
                      {acceptedLabel}
                    </span>
                  </span>
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-zinc-500">Revoked</span>
                    <span className="text-right text-zinc-300">
                      {revokedLabel}
                    </span>
                  </span>
                </div>

                {invite.status === "pending" && (
                  <div className="pt-1 flex justify-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-full border border-rose-500/40 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 hover:text-rose-100"
                      onClick={() => handleRevoke(invite.id)}
                      disabled={revokeInviteMutation.isPending}
                      title="Revoke invite"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="px-3 py-6 text-center text-sm text-zinc-500">
            No results.
          </div>
        )}
      </div>

      {/* Pagination footer */}
      <div className="flex items-center justify-between border-t border-zinc-800 px-3 py-2.5 text-[11px] md:text-xs text-zinc-400">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-1 rounded-none border border-zinc-800 bg-zinc-950/80 px-2.5 py-1">
            <span className="uppercase tracking-wide text-[10px] text-zinc-500">
              Page
            </span>
            <span className="text-xs font-semibold text-zinc-100">
              {page}
            </span>
            <span className="text-zinc-500">/</span>
            <span className="text-xs font-medium text-zinc-300">
              {pageCount || 1}
            </span>
          </div>
          <span className="hidden sm:inline text-zinc-500">
            • {invites.length} total invites
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            className="group relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-none border-none bg-[#ff9D4D] px-0 text-[10px] font-semibold text-zinc-950 shadow-sm transition-all hover:bg-[#ea9753] disabled:bg-zinc-800 disabled:text-zinc-500 disabled:shadow-none disabled:cursor-not-allowed"
            onClick={() => table.firstPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft className="h-3 w-3" />
            <span className="sr-only">First page</span>
          </Button>
          <Button
            size="sm"
            className="group relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-none border-none bg-[#ff9D4D] px-0 text-[10px] font-semibold text-zinc-950 shadow-sm transition-all hover:bg-[#ea9753] disabled:bg-zinc-800 disabled:text-zinc-500 disabled:shadow-none disabled:cursor-not-allowed"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-3 w-3" />
            <span className="sr-only">Previous page</span>
          </Button>
          <Button
            size="sm"
            className="group relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-none border-none bg-[#ff9D4D] px-0 text-[10px] font-semibold text-zinc-950 shadow-sm transition-all hover:bg-[#ea9753] disabled:bg-zinc-800 disabled:text-zinc-500 disabled:shadow-none disabled:cursor-not-allowed"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-3 w-3" />
            <span className="sr-only">Next page</span>
          </Button>
          <Button
            size="sm"
            className="group relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-none border-none bg-[#ff9D4D] px-0 text-[10px] font-semibold text-zinc-950 shadow-sm transition-all hover:bg-[#ea9753] disabled:bg-zinc-800 disabled:text-zinc-500 disabled:shadow-none disabled:cursor-not-allowed"
            onClick={() => table.lastPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight className="h-3 w-3" />
            <span className="sr-only">Last page</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
