import type {
  SigninResponse,
  SignupResponse,
  updateRoleResponse,
} from "../types";
import axiosInstance from "./axiosConfig";
import { type AxiosResponse } from "axios";
import type { UsersResponse } from "./robotApi";

class AuthApiService {
  async signupApi(data: object): Promise<SignupResponse | any> {
    try {
      const response: AxiosResponse<SignupResponse> = await axiosInstance.post(
        "/auth/signup",
        data,
      );
      return response;
    } catch (error) {
      console.error("Error in signup:", error);
      throw error;
    }
  }

  async signinApi(data: object): Promise<SigninResponse | any> {
    try {
      const response: AxiosResponse<SigninResponse> = await axiosInstance.post(
        "/auth/signin",
        data,
      );
      return response;
    } catch (error) {
      console.error("Error in signin:", error);
      throw error;
    }
  }

  async updateRole(id: string, data: object): Promise<updateRoleResponse> {
    try {
      const response: AxiosResponse<updateRoleResponse> =
        await axiosInstance.patch(`/auth/users/${id}/role`, data);
      return response.data;
    } catch (error) {
      console.error("Error in fetching logs:", error);
      throw error;
    }
  }

  // Check API Users
  async getUsers(): Promise<UsersResponse> {
    try {
      const response: AxiosResponse<UsersResponse> =
        await axiosInstance.get("/getUsers");
      return response.data;
    } catch (error) {
      console.error("Error in fetching users:", error);
      throw error;
    }
  }
}

export const authApi = new AuthApiService();
