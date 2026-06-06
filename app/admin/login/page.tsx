import { Suspense } from "react";

import { LoginForm } from "@/components/admin/LoginForm";

function LoginFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-hero-gradient">
      <div className="h-10 w-10 animate-pulse rounded-xl bg-cream" />
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}
