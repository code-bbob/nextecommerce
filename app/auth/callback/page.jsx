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

  return <div>Redirecting...</div>;
};

export default GoogleCallback;
