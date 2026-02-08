import { Suspense } from "react";
import { ChangePasswordForm } from "@/src/features/auth/components/ChangePasswordForm";

function ChangePasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChangePasswordForm />
    </Suspense>
  );
}

export default ChangePasswordPage;
