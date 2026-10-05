import api from "./api";
import type { Agent } from "../types/agent";

export const getAgents = async (): Promise<Agent[]> => {
  const response = await api.get<Agent[]>("/agents");

  return response.data;
};