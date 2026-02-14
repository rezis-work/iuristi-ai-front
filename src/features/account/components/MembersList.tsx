"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { formatDistanceToNow } from "date-fns";
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
  UserX,
  Shield,
} from "lucide-react";
import {
  useListMembers,
  useUpdateMemberRole,
  useRemoveMember,
} from "../hooks/use-members";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/components/ui/alert-dialog";
import type { MemberResponse } from "../api/members";
import { Input } from "@/src/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/src/components/ui/form";
import { UnderlinedFieldWrapper } from "@/src/components/shared/UnderlinedFieldWrapper";
import type { MemberRole } from "../schemas/members.schema";

interface MembersListProps {
  orgId: string | null;
}

const PAGE_SIZE = 10;

type SortKey = "email" | "name" | "role" | "createdAt" | null;
type SortDir = "asc" | "desc";

const getRoleColor = (role: string) => {
  switch (role.toLowerCase()) {
    case "owner":
      return "bg-purple-500/10 text-purple-300 border border-purple-500/30";
    case "lawyer":
      return "bg-blue-500/10 text-blue-300 border border-blue-500/30";
    case "paralegal":
      return "bg-cyan-500/10 text-cyan-300 border border-cyan-500/30";
    case "staff":
      return "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30";
    case "client":
      return "bg-amber-500/10 text-amber-300 border border-amber-500/30";
    default:
      return "bg-zinc-500/10 text-zinc-300 border border-zinc-500/30";
  }
};

const roleOptions = [
  { value: "owner", label: "Owner" },
  { value: "lawyer", label: "Lawyer" },
  { value: "paralegal", label: "Paralegal" },
  { value: "staff", label: "Staff" },
  { value: "client", label: "Client" },
] as const;

export function MembersList({ orgId }: MembersListProps) {
  const { data: members, isLoading, error } = useListMembers(orgId);
  const updateRoleMutation = useUpdateMemberRole(orgId);
  const removeMemberMutation = useRemoveMember(orgId);

  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [pageIndex, setPageIndex] = useState(0);
  const [memberToRemove, setMemberToRemove] = useState<MemberResponse | null>(
    null,
  );
  const [updatingMemberId, setUpdatingMemberId] = useState<string | null>(null);

  const form = useForm<{ search: string }>({
    defaultValues: { search: "" },
  });

  const ownerCount = useMemo(
    () => members?.filter((m) => m.role === "owner").length || 0,
    [members],
  );

  const isLastOwner = (member: MemberResponse) => {
    return member.role === "owner" && ownerCount === 1;
  };

  useEffect(() => {
    form.setValue("search", search);
  }, [search, form]);

  const handleRoleChange = (userId: string, newRole: string) => {
    setUpdatingMemberId(userId);
    updateRoleMutation.mutate(
      {
        userId,
        data: { role: newRole as MemberRole },
      },
      {
        onSettled: () => setUpdatingMemberId(null),
      },
    );
  };

  const handleRemoveClick = (member: MemberResponse) => {
    setMemberToRemove(member);
  };

  const handleRemoveConfirm = () => {
    if (memberToRemove) {
      removeMemberMutation.mutate(memberToRemove.userId);
      setMemberToRemove(null);
    }
  };

  const filtered = useMemo(() => {
    const list = members || [];
    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter(
      (m) =>
        m.email.toLowerCase().includes(q) ||
        (m.name?.toLowerCase().includes(q) ?? false) ||
        m.role.toLowerCase().includes(q),
    );
  }, [members, search]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal == null || bVal == null) return 0;
      const cmp =
        typeof aVal === "string" && typeof bVal === "string"
          ? aVal.localeCompare(bVal)
          : new Date(aVal).getTime() - new Date(bVal).getTime();
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  const paginated = useMemo(() => {
    const start = pageIndex * PAGE_SIZE;
    return sorted.slice(start, start + PAGE_SIZE);
  }, [sorted, pageIndex]);

  const pageCount = Math.ceil(sorted.length / PAGE_SIZE) || 1;
  const currentPage = pageIndex + 1;

  const toggleSort = (key: SortKey) => {
    if (!key) return;
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPageIndex(0);
  };

  const SortHeader = ({
    label,
    columnKey,
  }: {
    label: string;
    columnKey: SortKey;
  }) => (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-2 px-2 text-xs rounded-none font-medium uppercase tracking-wide text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60"
      onClick={() => toggleSort(columnKey)}
    >
      <span className="flex items-center gap-1">
        {label}
        {sortKey === columnKey ? (
          sortDir === "asc" ? (
            <ArrowUp className="h-3 w-3" />
          ) : (
            <ArrowDown className="h-3 w-3" />
          )
        ) : (
          <ArrowUpDown className="h-3 w-3 opacity-40" />
        )}
      </span>
    </Button>
  );

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
        <span>Failed to load members. Please try again.</span>
      </div>
    );
  }

  if (!members || members.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950/60 px-6 py-10 text-center">
        <Shield className="h-8 w-8 text-zinc-500 mb-2" />
        <p className="text-sm font-medium text-zinc-100">No members yet</p>
        <p className="text-xs text-zinc-500">
          Invite team members to start collaborating.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full overflow-x-hidden rounded-none border border-zinc-800 bg-zinc-950/60">
        {/* Search bar */}
        <div className="flex items-center gap-2 border-b border-zinc-800 px-3 py-2.5">
          <Form {...form}>
            <form onSubmit={(e) => e.preventDefault()} className="w-full">
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
                            setSearch(e.target.value);
                            setPageIndex(0);
                          }}
                          placeholder="Search members (email, name, role)..."
                          autoComplete="off"
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
            <TableRow className="border-zinc-800/80 hover:bg-transparent">
              <TableHead className="px-3 py-2.5 text-xs text-zinc-400">
                <SortHeader label="Email" columnKey="email" />
              </TableHead>
              <TableHead className="px-3 py-2.5 text-xs text-zinc-400">
                <SortHeader label="Name" columnKey="name" />
              </TableHead>
              <TableHead className="px-3 py-2.5 text-xs text-zinc-400">
                <SortHeader label="Role" columnKey="role" />
              </TableHead>
              <TableHead className="px-3 py-2.5 text-xs text-zinc-400">
                <SortHeader label="Joined" columnKey="createdAt" />
              </TableHead>
              <TableHead className="px-3 py-2.5 text-xs text-zinc-400">
                <span className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                  Actions
                </span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length ? (
              paginated.map((member, idx) => (
                <TableRow
                  key={member.userId}
                  className={`border-zinc-900/80 transition-colors hover:bg-zinc-900/60 ${
                    idx % 2 === 1 ? "bg-zinc-950/60" : ""
                  }`}
                >
                  <TableCell className="max-w-55 truncate px-3 py-2.5 align-middle text-sm text-zinc-200">
                    <div className="font-medium text-zinc-100">
                      {member.email}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-55 truncate px-3 py-2.5 align-middle text-sm text-zinc-200">
                    <div className="text-sm text-zinc-300">
                      {member.name || <span className="text-zinc-500">—</span>}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-55 truncate px-3 py-2.5 align-middle text-sm text-zinc-200">
                    <div className="relative">
                      <Select
                        value={member.role}
                        onValueChange={(value) =>
                          handleRoleChange(member.userId, value)
                        }
                        disabled={
                          isLastOwner(member) ||
                          updatingMemberId === member.userId
                        }
                      >
                        <SelectTrigger
                          className={`h-8 w-32 border-zinc-700 text-xs text-zinc-200 ${isLastOwner(member) || updatingMemberId === member.userId ? "bg-zinc-900/30 cursor-not-allowed opacity-60 hover:bg-zinc-900/30" : "bg-zinc-900/50 hover:bg-zinc-800/50"}`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-950 border-zinc-800">
                          {roleOptions.map((option) => (
                            <SelectItem
                              key={option.value}
                              value={option.value}
                              className="text-xs text-zinc-200 focus:bg-zinc-800 focus:text-zinc-100"
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-55 truncate px-3 py-2.5 align-middle text-sm text-zinc-200">
                    <div className="text-xs text-zinc-400">
                      {formatDistanceToNow(new Date(member.createdAt), {
                        addSuffix: true,
                      })}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-55 truncate px-3 py-2.5 align-middle text-sm text-zinc-200">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-full border border-rose-500/40 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 hover:text-rose-100 disabled:opacity-40 disabled:cursor-not-allowed"
                      onClick={() => handleRemoveClick(member)}
                      disabled={
                        removeMemberMutation.isPending || isLastOwner(member)
                      }
                      title={
                        isLastOwner(member)
                          ? "Cannot remove last owner"
                          : "Remove member"
                      }
                    >
                      <UserX className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
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
          {paginated.length ? (
            paginated.map((member) => {
              const joinedLabel = member.createdAt
                ? formatDistanceToNow(new Date(member.createdAt), {
                    addSuffix: true,
                  })
                : "—";

              return (
                <div
                  key={member.userId}
                  className="px-3 py-3 flex flex-col gap-2.5 bg-zinc-950/60"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-zinc-100">
                        {member.email}
                      </p>
                      {member.name && (
                        <p className="mt-0.5 text-[11px] text-zinc-400">
                          {member.name}
                        </p>
                      )}
                    </div>
                    <Badge
                      variant="outline"
                      className={`rounded-none px-2 py-0.5 text-[10px] font-medium ${getRoleColor(
                        member.role,
                      )}`}
                    >
                      {member.role}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="text-[11px] text-zinc-400">
                      <span className="text-zinc-500">Joined </span>
                      <span className="text-zinc-300">{joinedLabel}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select
                        value={member.role}
                        onValueChange={(value) =>
                          handleRoleChange(member.userId, value)
                        }
                        disabled={
                          isLastOwner(member) ||
                          updatingMemberId === member.userId
                        }
                      >
                        <SelectTrigger
                          className={`h-7 w-24 border-zinc-700 text-[10px] text-zinc-200 ${isLastOwner(member) || updatingMemberId === member.userId ? "bg-zinc-900/30 cursor-not-allowed opacity-60" : "bg-zinc-900/50"}`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-950 border-zinc-800">
                          {roleOptions.map((option) => (
                            <SelectItem
                              key={option.value}
                              value={option.value}
                              className="text-xs text-zinc-200"
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {isLastOwner(member) && (
                        <div
                          className="w-1.5 h-1.5 bg-amber-500 rounded-full"
                          title="Last owner - cannot change role"
                        />
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-full border border-rose-500/40 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20"
                        onClick={() => handleRemoveClick(member)}
                        disabled={
                          removeMemberMutation.isPending ||
                          isLastOwner(member)
                        }
                        title="Remove member"
                      >
                        <UserX className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
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
                {currentPage}
              </span>
              <span className="text-zinc-500">/</span>
              <span className="text-xs font-medium text-zinc-300">
                {pageCount}
              </span>
            </div>
            <span className="hidden sm:inline text-zinc-500">
              • {members.length} total members
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              size="sm"
              className="group relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-none border-none bg-[#ff9D4D] px-0 text-[10px] font-semibold text-zinc-950 shadow-sm transition-all hover:bg-[#ea9753] disabled:bg-zinc-800 disabled:text-zinc-500 disabled:shadow-none disabled:cursor-not-allowed"
              onClick={() => setPageIndex(0)}
              disabled={pageIndex === 0}
            >
              <ChevronsLeft className="h-3 w-3" />
              <span className="sr-only">First page</span>
            </Button>
            <Button
              size="sm"
              className="group relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-none border-none bg-[#ff9D4D] px-0 text-[10px] font-semibold text-zinc-950 shadow-sm transition-all hover:bg-[#ea9753] disabled:bg-zinc-800 disabled:text-zinc-500 disabled:shadow-none disabled:cursor-not-allowed"
              onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
              disabled={pageIndex === 0}
            >
              <ChevronLeft className="h-3 w-3" />
              <span className="sr-only">Previous page</span>
            </Button>
            <Button
              size="sm"
              className="group relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-none border-none bg-[#ff9D4D] px-0 text-[10px] font-semibold text-zinc-950 shadow-sm transition-all hover:bg-[#ea9753] disabled:bg-zinc-800 disabled:text-zinc-500 disabled:shadow-none disabled:cursor-not-allowed"
              onClick={() => setPageIndex((p) => Math.min(pageCount - 1, p + 1))}
              disabled={pageIndex >= pageCount - 1}
            >
              <ChevronRight className="h-3 w-3" />
              <span className="sr-only">Next page</span>
            </Button>
            <Button
              size="sm"
              className="group relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-none border-none bg-[#ff9D4D] px-0 text-[10px] font-semibold text-zinc-950 shadow-sm transition-all hover:bg-[#ea9753] disabled:bg-zinc-800 disabled:text-zinc-500 disabled:shadow-none disabled:cursor-not-allowed"
              onClick={() => setPageIndex(pageCount - 1)}
              disabled={pageIndex >= pageCount - 1}
            >
              <ChevronsRight className="h-3 w-3" />
              <span className="sr-only">Last page</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Remove member confirmation dialog */}
      <AlertDialog
        open={!!memberToRemove}
        onOpenChange={(open) => !open && setMemberToRemove(null)}
      >
        <AlertDialogContent className="bg-zinc-950 border-zinc-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-zinc-100">
              Remove Member
            </AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              Are you sure you want to remove{" "}
              <span className="font-semibold text-zinc-200">
                {memberToRemove?.email}
              </span>{" "}
              from this organization? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveConfirm}
              className="bg-rose-600 text-white hover:bg-rose-700"
              disabled={removeMemberMutation.isPending}
            >
              {removeMemberMutation.isPending ? "Removing..." : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
