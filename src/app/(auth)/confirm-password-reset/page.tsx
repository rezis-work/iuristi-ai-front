import { Suspense } from "react";
import { ConfirmPasswordResetForm } from "@/src/features/auth/components/confirm-password-reset-form";

function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConfirmPasswordResetForm />
    </Suspense>
  );
}

export default page;
