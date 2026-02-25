"use client";

import Modal from "@/src/components/shared/modal";
import OrgsEditForm from "./orgs-edit-form";
import { Building2 } from "lucide-react";

type OrgType = "law_firm" | "business" | "individual";

interface OrgsEditModaleProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  org: { id: string; name: string; type: string };
}

export default function OrgsEditModale({
  open,
  onOpenChange,
  org,
}: OrgsEditModaleProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={
        <span className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#ff9D4D]/15 text-[#ff9D4D]">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-lg font-semibold">ორგანიზაციის რედაქტირება</span>
            <span className="block text-sm text-neutral-500 font-normal mt-0.5">
              ორგანიზაციის დეტალების განახლება
            </span>
          </div>
        </span>
      }
      description={undefined}
      contentClassName="sm:max-w-md"
    >
      <div className="space-y-1 pt-1">
        <OrgsEditForm
          id={org.id}
          defaultValues={{
            name: org.name,
            type: org.type as OrgType,
          }}
          onSuccess={() => onOpenChange(false)}
        />
      </div>
    </Modal>
  );
}
