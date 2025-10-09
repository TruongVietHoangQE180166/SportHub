"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, User, Lock, Check, AlertCircle } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import { LoginCredentials } from "@/types/auth";
import Image from "next/image";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    username: "",
    password: "",
  });
  const [touched, setTouched] = useState({ username: false, password: false });
  const [remember, setRemember] = useState(false);

  const { login } = useAuthStore();
  const router = useRouter();

  const validateField = (name: string, value: string) => {
    switch (name) {
      case "username":
        if (!value.trim()) return "Vui lòng nhập tên đăng nhập";
        return "";
      case "password":
        if (!value) return "Vui lòng nhập mật khẩu";
        if (value.length < 6) return "Mật khẩu phải có ít nhất 6 ký tự";
        return "";
      default:
        return "";
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "username") setUsername(value);
    if (name === "password") setPassword(value);
    setFieldErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    if (error) setError("");
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const validateForm = () => {
    const errors = {
      username: validateField("username", username),
      password: validateField("password", password),
    };
    setFieldErrors(errors);
    setTouched({ username: true, password: true });
    return !Object.values(errors).some((error) => error !== "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const credentials: LoginCredentials = { username, password };
      await login(credentials);
      router.push("/");
    } catch (err: unknown) {
      const error = err as Error;
      // Show server error message or fallback to default message
      setError(error.message || "Tên đăng nhập hoặc mật khẩu không đúng");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div className="w-full max-w-sm">
        <div className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl p-6 ">
          {/* Logo - Compact */}
          <div className="text-center mb-6">
            <Link
              href="/"
              className="inline-flex items-center justify-center group"
            >
              <div className="w-50 h-14 relative mx-auto">
                <Image
                  src="/SportHub-Logo.png"
                  alt="SportHub Logo"
                  fill
                  style={{ objectFit: "contain" }}
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Header - Compact */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Đăng nhập</h1>
            <p className="text-gray-600 text-sm">
              Chào mừng bạn quay lại với SportHub
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 animate-in slide-in-from-top-2 duration-200">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
                  <p className="text-xs text-red-700 font-medium">{error}</p>
                </div>
              </div>
            )}

            <div className="space-y-1">
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  name="username"
                  type="text"
                  value={username}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full pl-10 pr-3 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-200 focus:outline-none transition-all duration-300 bg-white text-sm ${
                    touched.username && fieldErrors.username
                      ? "border-red-400 focus:border-red-500"
                      : "border-gray-200 focus:border-green-500"
                  }`}
                  placeholder="Tên đăng nhập"
                  required
                />
                {touched.username &&
                  !fieldErrors.username &&
                  username.trim() && (
                    <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 w-4 h-4 animate-fade-in" />
                  )}
              </div>
              {touched.username && fieldErrors.username && (
                <div className="flex items-center mt-1 ml-1">
                  <AlertCircle className="h-3 w-3 text-red-500 mr-1 flex-shrink-0" />
                  <p className="text-xs text-red-600">{fieldErrors.username}</p>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full pl-10 pr-3 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-200 focus:outline-none transition-all duration-300 bg-white text-sm ${
                    touched.password && fieldErrors.password
                      ? "border-red-400 focus:border-red-500"
                      : "border-gray-200 focus:border-green-500"
                  }`}
                  placeholder="Mật khẩu"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-500 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
                {touched.password &&
                  !fieldErrors.password &&
                  password.length >= 6 && (
                    <Check className="absolute right-8 top-1/2 transform -translate-y-1/2 text-green-500 w-4 h-4 animate-fade-in" />
                  )}
              </div>
              {touched.password && fieldErrors.password && (
                <div className="flex items-center mt-1 ml-1">
                  <AlertCircle className="h-3 w-3 text-red-500 mr-1 flex-shrink-0" />
                  <p className="text-xs text-red-600">{fieldErrors.password}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-3 w-3 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-gray-700"
                >
                  Ghi nhớ đăng nhập
                </label>
              </div>
              <div>
                <Link
                  href="/forgot-password"
                  className="font-medium text-green-600 hover:text-green-700 transition-colors"
                >
                  Quên mật khẩu?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang đăng nhập...
                </div>
              ) : (
                "Đăng nhập"
              )}
            </button>

            {/* Divider */}
            <div className="relative my-4">
              <div className="flex items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="px-3 text-xs text-gray-500 font-medium">Hoặc</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>
            </div>

            {/* Social Login */}
            <button
              type="button"
              onClick={() => window.location.href = 'https://sporthub-gdefgpgtf9h0g6gk.malaysiawest-01.azurewebsites.net/oauth2/authorization/google'}
              className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 hover:shadow-md"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Đăng nhập với Google
            </button>

            <div className="relative my-4">
              <div className="flex items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="px-3 text-xs text-gray-500 font-medium">Bảo mật</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>
            </div>
          </form>

          <p className="text-center text-gray-600 mt-4 text-sm">
            Chưa có tài khoản?{" "}
            <Link
              href="/register"
              className="text-green-600 hover:text-green-700 font-semibold underline decoration-green-300 transition-colors"
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}