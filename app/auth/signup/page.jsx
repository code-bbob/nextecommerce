"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader, Mail, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast, Toaster } from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import customFetch from "@/utils/customFetch";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [authUrl, setAuthUrl] = useState(null);
  const router = useRouter();

  const googleAuthEndpoint = "api/auth/google/";
  const signupEndpoint = "api/auth/signup/";

  useEffect(() => {
    const fetchAuthUrl = async () => {
      try {
        const response = await customFetch(googleAuthEndpoint, { method: "GET" });
        const data = await response.json();
        setAuthUrl(data.authorization_url);
      } catch (error) {
        console.error("Error fetching auth URL:", error);
      }
    };
    fetchAuthUrl();
  }, [googleAuthEndpoint]);

  const handleGoogleSignIn = () => {
    if (authUrl) {
      window.location.href = authUrl;
    } else {
      toast.error("Umm... Something went wrong. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await customFetch(signupEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.status === 200) {
        toast.success("Account created successfully!");
        router.push(`/auth/register?email=${encodeURIComponent(email)}`);
      } else {
        toast.error("Failed to create account");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again.");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <Toaster position="top-center" reverseOrder={false} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="p-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center"
          >
            <UserPlus className="w-10 h-10 text-white" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-indigo-400 text-transparent bg-clip-text"
          >
            Create an account
          </motion.h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="relative"
            >
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <Input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                required
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Button
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? <Loader className="w-6 h-6 animate-spin mx-auto" /> : "Continue"}
              </Button>
            </motion.div>
          </form>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-4"
          >
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-900 text-slate-400">Or continue with</span>
              </div>
            </div>
            <div className="mt-4">
              <Button
                onClick={handleGoogleSignIn}
                className="w-full bg-white text-gray-800 font-semibold py-3 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 flex items-center justify-center"
              >
                <FcGoogle className="w-6 h-6 mr-2" />
                Sign in with Google
              </Button>
            </div>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="px-8 py-4 bg-slate-900 bg-opacity-50 flex justify-center"
        >
          <p className="text-sm text-slate-400">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-blue-400 hover:text-blue-300 transition-colors">
              Sign In
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Signup;
