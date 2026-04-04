import { useState, useCallback } from "react";
import { AxiosError } from "axios";
import { authApi } from "../services/authApi";
import type { SigninResponse, SignupResponse } from "../types";

interface UseAuthApiReturn {
  isLoading: boolean;
  error: string | null;
  signup: (data: object) => Promise<SignupResponse>;
  signin: (data: object) => Promise<SigninResponse>;
}

const useAuthApi = (): UseAuthApiReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const signup = useCallback(
    async (data: object): Promise<SignupResponse | any> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await authApi.signupApi(data);
        return response;
      } catch (err) {
        const axiosError = err as AxiosError;
        let errorMessage = "Failed to sign up";

        if (axiosError.response) {
          errorMessage = `Server error: ${axiosError.response}`;
          console.error("Server response:", axiosError.response);
          return axiosError.response;
        } else if (axiosError.request) {
          errorMessage = "Cannot connect to server";
          return axiosError.response;
        } else {
          errorMessage = axiosError.message;
          return axiosError.response;
        }

        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const signin = useCallback(
    async (data: object): Promise<SigninResponse | any> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await authApi.signinApi(data);
        return response;
      } catch (err) {
        const axiosError = err as AxiosError;
        let errorMessage = "Failed to sign in";

        if (axiosError.response) {
          errorMessage = `Server error: ${axiosError.response}`;
          console.error("Server response:", axiosError.response);
          return axiosError.response;
        } else if (axiosError.request) {
          errorMessage = "Cannot connect to server";
          return axiosError.response;
        } else {
          errorMessage = axiosError.message;
          return axiosError.response;
        }

        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return {
    isLoading,
    error,
    signup,
    signin,
  };
};

export default useAuthApi;
