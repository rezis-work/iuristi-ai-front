"use client"

import { useState } from "react"
import { useGetOrgs } from "../hooks/orgs"
import OrgsCreateModale from "./orgs-create-modale"
import OrgsEditModale from "./orgs-edit-modale"
import { Building2, Edit2, Loader2 } from "lucide-react"

const ORG_TYPE_LABELS: Record<string, string> = {
  law_firm: "Law Firm",
  business: "Business",
  individual: "Individual",
}

export default function OrgsPage() {
  const { data: orgs, isLoading } = useGetOrgs()
  const [editingOrg, setEditingOrg] = useState<{ id: string; name: string; type: string } | null>(null)

  if (isLoading)
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-[#ff9D4D]" />
      </div>
    )

  const orgList = orgs ?? []
  const hasOrgs = orgList.length > 0

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-neutral-100">Organizations</h2>
          <p className="text-sm text-neutral-500 mt-0.5">Manage your organizations and workspaces</p>
        </div>
        <OrgsCreateModale />
      </div>

      {hasOrgs ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {orgList.map((org) => (
            <div
              key={org.id}
              className="group flex items-center justify-between gap-3 rounded-lg border border-neutral-700 bg-neutral-800/50 px-4 py-4 transition-colors hover:border-neutral-600 hover:bg-neutral-800/70"
            >
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#ff9D4D]/10 text-[#ff9D4D]">
                  <Building2 className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-neutral-100 truncate">{org.name}</p>
                  <p className="text-sm text-neutral-500">
                    {ORG_TYPE_LABELS[org.type] ?? org.type}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingOrg(org)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-700 hover:text-[#ff9D4D] focus:outline-none focus:ring-1 focus:ring-[#ff9D4D]/50"
                aria-label="Edit organization"
              >
                <Edit2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border-2 border-dashed border-neutral-700 bg-neutral-900/30 py-12 text-center">
          <Building2 className="mx-auto h-12 w-12 text-neutral-600" />
          <p className="mt-3 text-sm text-neutral-500">You have no organizations yet.</p>
        </div>
      )}

      {editingOrg && (
        <OrgsEditModale
          open={!!editingOrg}
          onOpenChange={(open) => !open && setEditingOrg(null)}
          org={editingOrg}
        />
      )}
    </div>
  )
}
