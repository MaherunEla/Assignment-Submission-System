import api from "./axios";
import { LoginRequest, LoginResponse } from "@/types/auth";

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/auth/login", data);

  return response.data;
}
