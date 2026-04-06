import { useState, useCallback } from "react";
import { AxiosError } from "axios";
import { authApi } from "../services/authApi";
import type {
  SigninResponse,
  SignupResponse,
  updateRoleResponse,
} from "../types";
import type { UsersResponse } from "../services/robotApi";

interface UseAuthApiReturn {
  isLoading: boolean;
  error: string | null;
  signup: (data: object) => Promise<SignupResponse>;
  signin: (data: object) => Promise<SigninResponse>;
  updateRole: (id: string, data: object) => Promise<updateRoleResponse>;
  getUsers: () => Promise<UsersResponse>;
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

  const updateRole = useCallback(
    async (id: string, data: object): Promise<updateRoleResponse | any> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await authApi.updateRole(id, data);
        return response;
      } catch (err) {
        const axiosError = err as AxiosError;
        let errorMessage = "Failed to update role";

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

  const getUsers = useCallback(async (): Promise<UsersResponse> => {
    setIsLoading(true);

    try {
      const users = await authApi.getUsers();
      return users;
    } catch (err) {
      const axiosError = err as AxiosError;
      let errorMessage = "Failed to fetch users";

      if (axiosError.response) {
        errorMessage = `Server error: ${axiosError.response.status}`;
      } else if (axiosError.request) {
        errorMessage = "Cannot connect to robot server";
      } else {
        errorMessage = axiosError.message;
      }

      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    signup,
    signin,
    updateRole,
    getUsers,
  };
};

export default useAuthApi;
