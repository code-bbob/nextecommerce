// /app/auth/register/page.js
import { Suspense } from "react";
import UserRegister from "./userRegister";

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="bg-gradient-to-br from-slate-900 to-slate-800">Loading...</div>}>
      <UserRegister />
    </Suspense>
  );
}
