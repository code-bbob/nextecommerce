"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { login } from "@/redux/accessSlice";
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";
const GoogleCallback = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const hasHandled = useRef(false); // Ensure the effect runs only once

  useEffect(() => {
    if (hasHandled.current) return;
    hasHandled.current = true;

    const params = new URLSearchParams(window.location.search);
    const access = params.get("access");
    const refresh = params.get("refresh");

    if (access && refresh) {
      // Store tokens in localStorage
      Cookies.set("accessToken", access, { expires: 1 });
        Cookies.set("refreshToken", refresh, { expires: 7 });
      dispatch(login());
      toast.success("Login successful!");
      router.push("/");
    } else {
      console.log("Tokens missing. Redirecting to login.");
      router.push("/auth/login");
    }
  }, [dispatch, router]);

  return (
    <div className="min-h-screen bg-white text-foreground flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto mb-4 h-12 w-12 relative" role="status" aria-live="polite" aria-label="Signing you in">
          <span className="sr-only">Signing you in…</span>
          <div className="absolute inset-0 rounded-full border-2 border-slate-200"></div>
          <div className="absolute inset-0 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"></div>
        </div>
        <h1 className="text-lg font-semibold tracking-tight">Signing you in</h1>
        <p className="mt-1 text-sm text-muted-foreground">Please wait while we complete your login…</p>
        <p className="mt-4 text-xs text-muted-foreground">
          If you’re not redirected automatically, <a href="/" className="text-blue-700 hover:underline">click here</a>.
        </p>
      </div>
    </div>
  );
};

export default GoogleCallback;
