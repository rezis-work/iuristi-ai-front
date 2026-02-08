import { Suspense } from "react";
import { ChangePasswordForm } from "@/src/features/auth/components/ChangePasswordForm";
import { Spinner } from "@/src/components/ui/spinner";
import Wrapper from "@/src/components/shared/wrapper";

function ChangePasswordPage() {
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
      <ChangePasswordForm />
    </Suspense>
  );
}

export default ChangePasswordPage;
