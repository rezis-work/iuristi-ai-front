"use client";

import { useState, useEffect } from "react";
import { Mail, Loader2, CheckCircle2, Send, Inbox } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useGetMe } from "@/src/features/user-account/profile/hooks/profile-api";
import { useRequestVerification } from "../hook/verification";

const RESEND_COOLDOWN_SEC = 60;

export function EmailVerificationSection() {
  const { data: profile, isLoading } = useGetMe();
  const { mutate: requestVerification, isPending } = useRequestVerification();
  const [verificationSent, setVerificationSent] = useState(false);
  const [cooldownLeft, setCooldownLeft] = useState(0);

  const handleRequestVerification = () => {
    requestVerification(
      {},
      {
        onSuccess: () => {
          setVerificationSent(true);
          setCooldownLeft(RESEND_COOLDOWN_SEC);
        },
      },
    );
  };

  useEffect(() => {
    if (cooldownLeft <= 0) return;
    const t = setInterval(() => setCooldownLeft((prev) => prev - 1), 1000);
    return () => clearInterval(t);
  }, [cooldownLeft]);

  if (isLoading) return null;
  if (!profile?.email) return null;

  const isVerified = profile.emailVerified === true;

  return (
    <div className="rounded-xl border border-neutral-700 bg-neutral-800/50 p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#ff9D4D]/10">
          <Mail className="h-5 w-5 text-[#ff9D4D]" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-neutral-100">
            ელფოსტის დადასტურება
          </h2>
          <p className="text-sm text-neutral-500">
            {isVerified
              ? "თქვენი ელფოსტა დადასტურებულია"
              : verificationSent
                ? "შეამოწმეთ თქვენი ელფოსტა"
                : "დაამთავრეთ ელფოსტის დადასტურება"}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-neutral-400">{profile.email}</span>
          {isVerified && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-500">
              <CheckCircle2 className="h-3.5 w-3.5" />
              დადასტურებული
            </span>
          )}
        </div>

        {!isVerified && (
          <>
            {isPending ? (
              <div className="flex items-center gap-2 text-sm text-neutral-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                იგზავნება...
              </div>
            ) : verificationSent ? (
              cooldownLeft > 0 ? (
                <p className="text-sm text-amber-500/90">
                  ხელახლა გაგზავნა: {cooldownLeft} წმ
                </p>
              ) : (
                <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRequestVerification}
                  className="h-9 rounded-lg border-neutral-600 bg-neutral-800/50 px-4 text-neutral-200 hover:bg-neutral-700/50 hover:text-white"
                >
                  <Send className="mr-2 h-4 w-4" />
                  ხელახლა გაგზავნა
                </Button>
              )
            ) : (
              <Button
                type="button"
                onClick={handleRequestVerification}
                className="h-9 rounded-lg bg-[#ff9D4D] px-4 font-medium text-white hover:bg-[#ff8D3D]"
              >
                <Send className="mr-2 h-4 w-4" />
                გაგზავნა
              </Button>
            )}
          </>
        )}
      </div>

      {!isVerified && (
        <p className="mt-3 text-xs text-neutral-500">
          {verificationSent ? (
            <span className="inline-flex items-center gap-1.5">
              <Inbox className="h-3.5 w-3.5" />
              დადასტურების ბმული გაგზავნილია. შეამოწმეთ შემოსულები და სპამი.
            </span>
          ) : (
            "გააგზავნეთ დადასტურების ბმული თქვენს ელფოსტაზე."
          )}
        </p>
      )}
    </div>
  );
}
