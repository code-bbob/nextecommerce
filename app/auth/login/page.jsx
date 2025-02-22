"use client";
import Cookies from 'js-cookie';
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { login } from "@/redux/accessSlice";
import { motion } from "framer-motion";
import { Loader, Lock, Mail, Eye, EyeOff } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "@/components/ui/input";
import { toast, Toaster } from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import customFetch from "@/utils/customFetch";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authUrl, setAuthUrl] = useState(null);

  const router = useRouter();
  const dispatch = useDispatch();

  const googleAuthEndpoint = "/api/auth/google/"; 
  const loginEndpoint = "/api/auth/login/";

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
    setError("");

    try {
      const response = await customFetch(loginEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.status === 200) {
        const data = await response.json();
        Cookies.set('accessToken', data.token.access, { expires: 1, path: '/' });
        Cookies.set('refreshToken', data.token.refresh, { expires: 1, path: '/' });
        dispatch(login());
        toast.success("Login successful!");
        router.replace("/");
      } else if (response.status === 400) {
        setError("Invalid email or password");
        toast.error("Login failed. Please try again.");
      } else {
        setError("An error occurred. Please try again.");
        toast.error("An error occurred. Please try again.");
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError("An error occurred. Please try again.");
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <Toaster position="top-center" reverseOrder={false} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center"
          >
            <Lock className="w-10 h-10 text-white" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-2xl font-bold mb-4 text-center bg-gradient-to-r from-blue-400 to-indigo-400 text-transparent bg-clip-text"
          >
            Welcome Back
          </motion.h2>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="relative"
            >
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex items-center justify-between"
            >
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="form-checkbox text-blue-500" />
                <span className="text-sm text-slate-300">Remember me</span>
              </label>
              <Link href="/auth/forgot-password" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                Forgot Password?
              </Link>
            </motion.div>
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 font-semibold text-center"
              >
                {error}
              </motion.p>
            )}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <Button
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? <Loader className="w-6 h-6 animate-spin mx-auto" /> : "Login"}
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
          transition={{ delay: 0.9, duration: 0.5 }}
          className="px-6 py-3 bg-slate-900 bg-opacity-50 flex justify-center"
        >
          <p className="text-sm pb-4 text-slate-400">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-blue-400 hover:text-blue-300 transition-colors">
              Sign Up
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
