"use client";

import { useState } from "react";
import Modal from "@/src/components/shared/modal";
import OrgsCreatePage from "./orgs-create";
import { Building2, Plus } from "lucide-react";

interface OrgsCreateModaleProps {
  /** Custom trigger. If not provided, renders default create card */
  trigger?: React.ReactNode;
}

export default function OrgsCreateModale({ trigger }: OrgsCreateModaleProps) {
  const [open, setOpen] = useState(false);

  const defaultTrigger = (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="group flex items-center gap-4 w-full sm:w-auto min-w-[200px] p-4 rounded-lg border-2 border-dashed border-neutral-700 hover:border-[#ff9D4D]/60 bg-neutral-900/30 hover:bg-neutral-800/50 transition-all duration-200"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#ff9D4D]/10 text-[#ff9D4D] group-hover:bg-[#ff9D4D]/20 transition-colors cursor-pointer">
        <Plus className="h-6 w-6" strokeWidth={2} />
      </div>
      <div className="text-left cursor-pointer">
        <span className="block text-sm font-semibold text-neutral-100 group-hover:text-[#ff9D4D] transition-colors">
          ორგანიზაციის შექმნა
        </span>
        <span className="block text-xs text-neutral-500 mt-0.5">
          დაამატე ახალი ორგანიზაცია შენს სამუშაო სივრცეში
        </span>
      </div>
    </button>
  );

  return (
    <>
      {trigger ? (
        <div onClick={() => setOpen(true)} className="cursor-pointer inline-flex">
          {trigger}
        </div>
      ) : (
        defaultTrigger
      )}
      <Modal
        open={open}
        onOpenChange={setOpen}
        title={
          <span className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#ff9D4D]/15 text-[#ff9D4D]">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-lg font-semibold">ორგანიზაციის შექმნა</span>
              <span className="block text-sm text-neutral-500 font-normal mt-0.5">დაამატე ახალი ორგანიზაცია სამუშაო სივრცის სამართავად</span>
            </div>
          </span>
        }
        description={undefined}
        contentClassName="sm:max-w-md"
      >
        <OrgsCreatePage compact onSuccess={() => setOpen(false)} />
      </Modal>
    </>
  );
}
