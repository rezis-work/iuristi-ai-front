import { Suspense } from "react";
import { ConfirmPasswordResetForm } from "@/src/features/auth/components/confirm-password-reset-form";
import { Spinner } from "@/src/components/ui/spinner";
import Wrapper from "@/src/components/shared/wrapper";

function page() {
  return (
    <Suspense
      fallback={
        <Wrapper className="mx-auto">
          <div className="w-full md:max-w-xl mx-auto flex items-center justify-center py-20">
            <Spinner className="size-8 text-[#FF9D4D]" />
          </div>
        </Wrapper>
      }
    >
      <ConfirmPasswordResetForm />
    </Suspense>
  );
}

export default page;
