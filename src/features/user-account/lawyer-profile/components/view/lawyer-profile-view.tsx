"use client";

import type { LawyerProfileResponce } from "../../api/layer-profile";
import {
  lawyerFieldDisplayNames,
  normalizeProfileFields,
  type LawyerField,
} from "../../schemas/lawyer-schema";
import { Briefcase, Loader2 } from "lucide-react";

interface LawyerProfileViewProps {
  profile: LawyerProfileResponce | undefined;
  isLoading?: boolean;
  /** When true, skip "No lawyer profile yet" (parent shows org message instead) */
  noOrgMessage?: boolean;
}

export function LawyerProfileView({
  profile,
  isLoading,
  noOrgMessage,
}: LawyerProfileViewProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#ff9D4D]" />
      </div>
    );
  }

  if (noOrgMessage) {
    return null;
  }

  if (!profile) {
    return (
      <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-6">
        <p className="text-sm text-neutral-400">
          No lawyer profile yet. Select practice areas below to create one.
        </p>
      </div>
    );
  }

  const fields = normalizeProfileFields(profile.fields || []);
  const displayFields = fields.map((f) => lawyerFieldDisplayNames[f]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Briefcase className="h-5 w-5 text-[#ff9D4D]" />
        <h3 className="text-lg font-semibold text-neutral-100">
          Practice Areas
        </h3>
      </div>
      {displayFields.length > 0 ? (
        <ul className="space-y-2">
          {displayFields.map((label) => (
            <li
              key={label}
              className="flex items-center gap-2 text-sm text-neutral-200"
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#ff9D4D]" />
              {label}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-neutral-500">No practice areas selected.</p>
      )}
    </div>
  );
}
