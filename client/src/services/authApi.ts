import type { SigninResponse, SignupResponse } from "../types";
import axiosInstance from "./axiosConfig";
import { type AxiosResponse } from "axios";

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
}

export const authApi = new AuthApiService();
