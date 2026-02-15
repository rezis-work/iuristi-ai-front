import { Suspense } from "react";
import { LoginForm } from "@/src/features/auth/components/login-form";

export default function LoginPage() {
  return (
    <div>
      <Suspense fallback={<div className="min-h-[400px] flex items-center justify-center" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
