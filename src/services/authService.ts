import api from "./api";

export interface LoginRequest {
  email: string;
  password: string;
}

export const loginUser = async (
  data: LoginRequest
): Promise<string> => {
  const response = await api.post<string>(
    "/auth/login",
    data
  );

  return response.data;
};

export const loginAgent = async (data: { email: string; password: string }) => {
  const response = await api.post("/auth/agent/login", data);
  return response.data;
};