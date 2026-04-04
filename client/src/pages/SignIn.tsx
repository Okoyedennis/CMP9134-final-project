import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import AuthInput from "../components/AuthInput";
import useAuthApi from "../hooks/useAuthApi";
import { toast } from "react-toastify";
import { useCookies } from "../hooks/useCookies";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signin, isLoading } = useAuthApi();

  const { setCookie } = useCookies();

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email is required");
      return;
    }
    if (!password) {
      toast.error("Password is required");
      return;
    }

    const data = { email, password };

    try {
      const response = await signin(data);

      if (response.data && response.data.success) {
        toast.success(response.data.message);
        setCookie("gcs_token", response.data.token, { path: "/" });
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else if (response.data && !response.data.success) {
        toast.error(response.data.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  return (
    <AuthLayout title="Sign In" subtitle="Access your robot control dashboard">
      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthInput
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="Enter your email"
        />

        <AuthInput
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="Enter your password"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 transition rounded-lg py-3 font-semibold disabled:opacity-60">
          {isLoading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="text-sm text-gray-400 mt-6 text-center">
        Don’t have an account?{" "}
        <Link to="/signup" className="text-blue-400 hover:underline">
          Create one
        </Link>
      </p>
    </AuthLayout>
  );
}
