"use client"

import { useState } from "react"
import { useGetOrgs } from "../hooks/orgs"
import { useORgs } from "../lib/org-state"
import { useOrgType } from "../lib/orgs-type"
import OrgsCreateModale from "./orgs-create-modale"
import OrgsEditModale from "./orgs-edit-modale"
import { Building2, Edit2, Loader2 } from "lucide-react"

const VALID_TYPES = ["law_firm", "business", "individual"] as const

const ORG_TYPE_LABELS: Record<string, string> = {
  law_firm: "Law Firm",
  business: "Business",
  individual: "Individual",
}

export default function OrgsPage() {
  const { data: orgs, isLoading } = useGetOrgs()
  const { orgs: selectedOrgId } = useORgs()
  const { type: urlType } = useOrgType()
  const [editingOrg, setEditingOrg] = useState<{ id: string; name: string; type: string } | null>(null)

  const orgList = orgs ?? []
  const selectedOrg =
    selectedOrgId && selectedOrgId !== "default"
      ? orgList.find((o) => o.id === selectedOrgId)
      : undefined

  // URL-ის type უპირატესია (როცა მომხმარებელი დაარედაქტირა და გადაინახა ლინკი)
  const displayType =
    urlType && VALID_TYPES.includes(urlType as (typeof VALID_TYPES)[number])
      ? urlType
      : selectedOrg?.type ?? ""

  if (isLoading)
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-[#ff9D4D]" />
      </div>
    )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-neutral-100">Organizations</h2>
          <p className="text-sm text-neutral-500 mt-0.5">Manage your organizations and workspaces</p>
        </div>
        <OrgsCreateModale />
      </div>

      {orgList.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-neutral-700 bg-neutral-900/30 py-12 text-center">
          <Building2 className="mx-auto h-12 w-12 text-neutral-600" />
          <p className="mt-3 text-sm text-neutral-500">You have no organizations yet.</p>
          <p className="mt-1 text-sm text-neutral-500">Create one using the button above.</p>
        </div>
      ) : selectedOrg ? (
        <div className="group flex items-center justify-between gap-3 rounded-lg border border-neutral-700 bg-neutral-800/50 px-4 py-4 transition-colors hover:border-neutral-600 hover:bg-neutral-800/70">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#ff9D4D]/10 text-[#ff9D4D]">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-neutral-100 truncate">{selectedOrg.name}</p>
              <p className="text-sm text-neutral-500">
                {ORG_TYPE_LABELS[displayType] ?? displayType}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() =>
              setEditingOrg({ ...selectedOrg, type: displayType || selectedOrg.type })
            }
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-700 hover:text-[#ff9D4D] focus:outline-none focus:ring-1 focus:ring-[#ff9D4D]/50"
            aria-label="Edit organization"
          >
            <Edit2 className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="rounded-lg border border-neutral-700 bg-neutral-800/30 py-8 text-center">
          <p className="text-sm text-neutral-500">Select an organization from the dropdown above to view and edit it.</p>
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
