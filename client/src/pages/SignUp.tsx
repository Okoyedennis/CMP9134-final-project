import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import TextInput from "../common/TextInput";
import useAuthApi from "../hooks/useAuthApi";
import { toast } from "react-toastify";
import PageHelmet from "../components/PageHelmet";
import Button from "../components/Button";

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
    <>
      <PageHelmet
        title="Sign Up | Robot GCS"
        description="Create an account to access the Ground Control Station."
      />
      <AuthLayout
        title="Create Account"
        subtitle="Register to access the Ground Control Station">
        <form onSubmit={handleSubmit} className="space-y-5">
          <TextInput
            label="Forename"
            value={forename}
            onChange={setForename}
            placeholder="Enter your forename"
          />

          <TextInput
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="Enter your email"
          />

          <TextInput
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="Enter your password"
          />

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition rounded-lg py-3 font-semibold disabled:opacity-60"
            isLoading={isLoading}
            disabled={isLoading}>
            Sign Up
          </Button>
        </form>

        <p className="text-sm text-gray-400 mt-6 text-center">
          Already have an account?{" "}
          <Link to="/signin" className="text-blue-400 hover:underline">
            Sign in
          </Link>
        </p>
      </AuthLayout>
    </>
  );
};

export default SignUp;
