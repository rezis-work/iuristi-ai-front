"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
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
import { useDeleteInvite } from "../hooks/invite";
import type { InviteListItem } from "../api/invite";
import { Trash2 } from "lucide-react";

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  accepted: "Accepted",
  revoked: "Revoked",
  expired: "Expired",
};

const STATUS_BADGE_CLASSES: Record<string, string> = {
  pending: "bg-[#ff9D4D]/20 text-[#ff9D4D] border-[#ff9D4D]/40",
  accepted: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
  revoked: "bg-zinc-700/80 text-zinc-400 border-zinc-600",
  expired: "bg-red-500/20 text-red-400 border-red-500/40",
};

const ROLE_LABELS: Record<string, string> = {
  owner: "Owner",
  lawyer: "Lawyer",
  admin: "Admin",
  paralegal: "Paralegal",
  staff: "Staff",
  member: "Member",
  client: "Client",
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function InviteRow({
  invite,
  orgId,
  canManage,
}: {
  invite: InviteListItem;
  orgId: string;
  canManage: boolean;
}) {
  const deleteInvite = useDeleteInvite(orgId, invite.id);
  const isPending = invite.status === "pending";
  const canRevoke = canManage && isPending;

  const handleRevoke = () => {
    deleteInvite.mutate();
  };

  return (
    <TableRow className="border-neutral-800 hover:bg-neutral-900/50 transition-colors">
      <TableCell className="py-4">
        <p className="font-medium text-neutral-100">{invite.email}</p>
      </TableCell>
      <TableCell className="py-4">
        <Badge
          variant="outline"
          className={
            ROLE_LABELS[invite.role]
              ? "bg-zinc-800/50 text-neutral-300 border-neutral-600"
              : ""
          }
        >
          {ROLE_LABELS[invite.role] ?? invite.role}
        </Badge>
      </TableCell>
      <TableCell className="py-4 text-neutral-400 text-sm">
        {formatDate(invite.expiresAt)}
      </TableCell>
      <TableCell className="py-4">
        <Badge
          variant="outline"
          className={
            STATUS_BADGE_CLASSES[invite.status] ??
            "bg-zinc-800/50 text-neutral-400"
          }
        >
          {STATUS_LABELS[invite.status] ?? invite.status}
        </Badge>
      </TableCell>
      <TableCell className="py-4 text-right">
        {canRevoke && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-red-400 hover:text-red-300 hover:bg-red-950/30 cursor-pointer"
                disabled={deleteInvite.isPending}
                aria-label="Revoke invite"
              >
                <Trash2 className="size-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-zinc-900 border-neutral-700">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-neutral-100">
                  Revoke Invite
                </AlertDialogTitle>
                <AlertDialogDescription className="text-neutral-400">
                  Are you sure you want to revoke the invite for {invite.email}?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-zinc-800 border-neutral-700 text-neutral-200 hover:bg-zinc-700 cursor-pointer">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleRevoke}
                  className="bg-red-600 text-white hover:bg-red-500 transition-colors cursor-pointer"
                >
                  Revoke
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </TableCell>
    </TableRow>
  );
}

export function InvitesList({
  invites,
  orgId,
  canManage = true,
}: {
  invites: InviteListItem[];
  orgId: string;
  canManage?: boolean;
}) {
  const pendingInvites = invites.filter((i) => i.status === "pending");
  const otherInvites = invites.filter((i) => i.status !== "pending");

  if (invites.length === 0) {
    return null;
  }

  return (
    <Table className="[&_tr]:border-neutral-800">
      <TableHeader>
        <TableRow className="border-neutral-800 hover:bg-transparent">
          <TableHead className="text-neutral-400 font-medium">Email</TableHead>
          <TableHead className="text-neutral-400 font-medium">Role</TableHead>
          <TableHead className="text-neutral-400 font-medium">Expires</TableHead>
          <TableHead className="text-neutral-400 font-medium">Status</TableHead>
          <TableHead className="w-[60px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...pendingInvites, ...otherInvites].map((invite) => (
          <InviteRow
            key={invite.id}
            invite={invite}
            orgId={orgId}
            canManage={canManage}
          />
        ))}
      </TableBody>
    </Table>
  );
}
