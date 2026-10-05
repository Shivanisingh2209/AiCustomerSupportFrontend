import api from "./api";
import type { Agent } from "../types/agent";

export const getAgents = async (): Promise<Agent[]> => {
  const response = await api.get<Agent[]>("/agents");

  return response.data;
};

export const updateAgentStatus = async (
  agentId: string,
  status: string
): Promise<Agent> => {
  const response = await api.patch<Agent>(
    `/agents/${agentId}/status?status=${status}`
  );

  return response.data;
};