"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/src/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useGetOrgs } from "@/src/features/user-account/orgs/hooks/orgs";
import { useORgs } from "@/src/features/user-account/orgs/lib/org-state";
import {
  useGetMembers,
  useRemoveMember,
  useUpdateMemberRole,
} from "../hooks/use-members";
import type { Member } from "../api/memebers";
import type { UpdateMemberRoleInput } from "../schemas/memebers-schema";
import { UserMinus, Users, Loader2, Pencil, Trash2 } from "lucide-react";

const ROLE_LABELS: Record<string, string> = {
  owner: "Owner",
  admin: "Admin",
  member: "Member",
  lawyer: "Lawyer",
  paralegal: "Paralegal",
  staff: "Staff",
  client: "Client",
};

const ROLE_BADGE_CLASSES: Record<string, string> = {
  owner: "bg-[#ff9D4D]/30 text-[#ffb366] font-medium border-[#ff9D4D]/60 shadow-sm",
  admin: "bg-indigo-500/30 text-indigo-300 font-medium border-indigo-400/50 shadow-sm",
  member: "bg-sky-500/30 text-sky-300 font-medium border-sky-400/50 shadow-sm",
  lawyer: "bg-emerald-500/35 text-emerald-300 font-medium border-emerald-400/60 shadow-sm",
  paralegal: "bg-violet-500/35 text-violet-300 font-medium border-violet-400/60 shadow-sm",
  staff: "bg-slate-500/35 text-slate-200 font-medium border-slate-400/50 shadow-sm",
  client: "bg-amber-500/35 text-amber-200 font-medium border-amber-400/60 shadow-sm",
};

const EDITABLE_ROLES: { value: UpdateMemberRoleInput["role"]; label: string }[] = [
  { value: "lawyer", label: ROLE_LABELS.lawyer },
  { value: "paralegal", label: ROLE_LABELS.paralegal },
  { value: "staff", label: ROLE_LABELS.staff },
  { value: "client", label: ROLE_LABELS.client },
];

function getInitials(name?: string | null, email?: string) {
  if (name?.trim()) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  if (email) {
    return email[0]?.toUpperCase() ?? "?";
  }
  return "?";
}

function EditMemberModal({
  member,
  orgId,
  open,
  onOpenChange,
}: {
  member: Member;
  orgId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const updateRole = useUpdateMemberRole(orgId, member.userId);
  const removeMember = useRemoveMember(orgId, member.userId);
  const [selectedRole, setSelectedRole] = useState<string>(member.role);

  React.useEffect(() => {
    if (open) setSelectedRole(member.role);
  }, [open, member.role]);

  const handleSave = () => {
    const role = selectedRole as UpdateMemberRoleInput["role"];
    const isValidRole = EDITABLE_ROLES.some((r) => r.value === role);
    if (role && isValidRole && role !== member.role) {
      updateRole.mutate(
        { role },
        {
          onSuccess: () => onOpenChange(false),
        }
      );
    } else {
      onOpenChange(false);
    }
  };

  const handleRemove = () => {
    removeMember.mutate(undefined, {
      onSuccess: () => onOpenChange(false),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-neutral-700 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-neutral-100">Edit Member</DialogTitle>
          <DialogDescription className="text-neutral-400">
            Change role or remove {member.name ?? member.email} from the organization.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="flex items-center gap-3">
            <Avatar className="size-10 border border-neutral-700">
              <AvatarImage src={member.avatarUrl ?? undefined} alt={member.name ?? member.email} />
              <AvatarFallback className="bg-zinc-800 text-neutral-200 text-sm">
                {getInitials(member.name, member.email)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-neutral-100">{member.name ?? "—"}</p>
              <p className="text-neutral-400 text-sm">{member.email ?? "—"}</p>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-200">Role</label>
            <Select
              value={selectedRole}
              onValueChange={setSelectedRole}
              disabled={updateRole.isPending}
            >
              <SelectTrigger className="w-full bg-zinc-800/80 border-neutral-700 text-neutral-200 cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-neutral-700">
                {EDITABLE_ROLES.map((r) => (
                  <SelectItem
                    key={r.value}
                    value={r.value}
                    className="text-neutral-200 data-highlighted:bg-zinc-700 data-highlighted:text-white data-[state=checked]:bg-[#ff9D4D]/20 data-[state=checked]:text-[#ffb366]"
                  >
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-between">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="border-red-500/50 text-red-400 hover:bg-red-950/30 hover:text-red-300 order-2 sm:order-1 cursor-pointer"
                disabled={removeMember.isPending}
              >
                <Trash2 className="mr-2 size-4" />
                Remove Member
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-zinc-900 border-neutral-700">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-neutral-100">
                  Remove Member
                </AlertDialogTitle>
                <AlertDialogDescription className="text-neutral-400">
                  Are you sure you want to remove {member.name ?? member.email} from the
                  organization? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-zinc-800 border-neutral-700 text-neutral-200 hover:bg-zinc-700 cursor-pointer">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleRemove}
                  className="bg-red-600 text-white hover:bg-red-500 cursor-pointer"
                >
                  Remove
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <div className="flex gap-2 order-1 sm:order-2">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={updateRole.isPending || selectedRole === member.role}
              className="bg-[#ff9D4D] hover:bg-[#ffa95d] text-white cursor-pointer"
            >
              {updateRole.isPending ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : null}
              Save Changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function MemberRow({
  member,
  orgId,
  canManage,
}: {
  member: Member;
  orgId: string;
  canManage: boolean;
}) {
  const removeMember = useRemoveMember(orgId, member.userId);
  const [editOpen, setEditOpen] = useState(false);
  const isOwner = member.role === "owner";
  const canEdit = canManage && !isOwner;

  const handleRemove = () => {
    removeMember.mutate();
  };

  return (
    <>
      <TableRow className="border-neutral-800 hover:bg-neutral-900/50 transition-colors">
        <TableCell className="py-4">
          <div className="flex items-center gap-3">
            <Avatar className="size-9 border border-neutral-700">
              <AvatarImage src={member.avatarUrl ?? undefined} alt={member.name ?? member.email} />
              <AvatarFallback className="bg-zinc-800 text-neutral-200 text-xs">
                {getInitials(member.name, member.email)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-neutral-100">{member.name ?? "—"}</p>
              <p className="text-neutral-400 text-sm">{member.email ?? "—"}</p>
            </div>
          </div>
        </TableCell>
        <TableCell className="py-4">
          <Badge
            variant="outline"
            className={ROLE_BADGE_CLASSES[member.role] ?? ROLE_BADGE_CLASSES.member}
          >
            {ROLE_LABELS[member.role] ?? member.role}
          </Badge>
        </TableCell>
        <TableCell className="py-4 text-right">
          {canEdit && (
            <div className="flex items-center justify-end gap-1">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setEditOpen(true)}
                className="text-neutral-400 hover:text-[#ff9D4D] hover:bg-[#ff9D4D]/10 cursor-pointer"
                aria-label="Edit member"
              >
                <Pencil className="size-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-red-400 hover:text-red-300 hover:bg-red-950/30 cursor-pointer"
                    disabled={removeMember.isPending}
                    aria-label="Remove member"
                  >
                    <UserMinus className="size-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-zinc-900 border-neutral-700">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-neutral-100">
                      Remove Member
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-neutral-400">
                      Are you sure you want to remove {member.name ?? member.email} from the
                      organization? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-zinc-800 border-neutral-700 text-neutral-200 hover:bg-zinc-700 cursor-pointer">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleRemove}
                      className="bg-red-600 text-white hover:bg-red-500 cursor-pointer"
                    >
                      Remove
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </TableCell>
      </TableRow>
      {canEdit && (
        <EditMemberModal
          member={member}
          orgId={orgId}
          open={editOpen}
          onOpenChange={setEditOpen}
        />
      )}
    </>
  );
}

function MembersTableSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-14 w-full bg-zinc-800" />
      ))}
    </div>
  );
}

export function Members() {
  const { data: orgs, isLoading: isOrgsLoading } = useGetOrgs();
  const { orgs: selectedOrgId } = useORgs();
  const orgList = orgs ?? [];
  const isValidSelected =
    selectedOrgId && selectedOrgId !== "default" && orgList.some((o) => o.id === selectedOrgId);
  const orgId = isValidSelected ? selectedOrgId : orgList[0]?.id ?? null;
  const { data: members = [], isLoading: isMembersLoading } = useGetMembers(
    orgId ?? ""
  );
  const isLoading = isOrgsLoading || (!!orgId && isMembersLoading);

  // Assume current user can manage if they have org (simplified)
  const canManage = true;

  if (isOrgsLoading || !orgId) {
    return (
      <Card className="bg-transparent rounded-none md:rounded-sm border-none">
        <CardHeader className="px-0 pb-4">
          <CardTitle className="text-xl sm:text-2xl font-semibold text-neutral-100 flex items-center gap-2">
            <Users className="h-6 w-6 text-[#ff9D4D]" />
            Organization Members
          </CardTitle>
          <CardDescription className="text-neutral-400">
            {!orgId && !isOrgsLoading
              ? "Organization not selected or not found."
              : "Loading members..."}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          {isOrgsLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#ff9D4D]" />
            </div>
          ) : (
            <MembersTableSkeleton />
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-transparent rounded-none md:rounded-sm border-none">
      <CardHeader className="px-0 pb-4">
        <CardTitle className="text-xl sm:text-2xl font-semibold text-neutral-100 flex items-center gap-2">
          <Users className="h-6 w-6 text-[#ff9D4D]" />
            Organization Members
        </CardTitle>
        <CardDescription className="text-neutral-400">
          {members.length} member{members.length !== 1 ? "s" : ""} total
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#ff9D4D]" />
          </div>
        ) : members.length === 0 ? (
          <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-6 text-center">
            <p className="text-neutral-400">No members yet</p>
            <p className="text-sm text-neutral-500 mt-1">
              Add members via invite
            </p>
          </div>
        ) : (
          <Table className="[&_tr]:border-neutral-800">
            <TableHeader>
              <TableRow className="border-neutral-800 hover:bg-transparent">
                <TableHead className="text-neutral-400 font-medium">Name</TableHead>
                <TableHead className="text-neutral-400 font-medium">Role</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <MemberRow
                  key={member.userId}
                  member={member}
                  orgId={orgId}
                  canManage={canManage}
                />
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
