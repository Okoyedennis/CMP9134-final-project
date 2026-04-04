import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import AuthInput from "../components/AuthInput";
import useAuthApi from "../hooks/useAuthApi";
import { toast } from "react-toastify";

const SignUp = () => {
  const [forename, setForename] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const { signup, isLoading } = useAuthApi();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!forename) {
      toast.error("Forename is required");
      return;
    }
    if (!email) {
      toast.error("Email is required");
      return;
    }
    if (!password) {
      toast.error("Password is required");
      return;
    }

    const data = { forename, email, password };

    try {
      const response = await signup(data);

      if (response.data && response.data.success) {
        toast.success(response.data.message);
        setTimeout(() => {
          navigate("/signin");
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
    <AuthLayout
      title="Create Account"
      subtitle="Register to access the Ground Control Station">
      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthInput
          label="Forename"
          value={forename}
          onChange={setForename}
          placeholder="Enter your forename"
        />

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
          {isLoading ? "Creating account..." : "Sign Up"}
        </button>
      </form>

      <p className="text-sm text-gray-400 mt-6 text-center">
        Already have an account?{" "}
        <Link to="/signin" className="text-blue-400 hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
};

export default SignUp;
