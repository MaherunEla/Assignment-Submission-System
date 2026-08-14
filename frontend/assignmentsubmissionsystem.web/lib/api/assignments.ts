import api from "./axios";

import {
  Assignment,
  CreateAssignmentRequest,
  UpdateAssignmentRequest,
} from "@/types/assignment";

export async function getAssignments(): Promise<Assignment[]> {
  const response = await api.get<Assignment[]>("/assignments");

  return response.data;
}

export async function getAssignment(id: number): Promise<Assignment> {
  const response = await api.get<Assignment>(`/assignments/${id}`);

  return response.data;
}

export async function getMyAssignments(): Promise<Assignment[]> {
  const response = await api.get<Assignment[]>("/teachers/me/assignments");

  return response.data;
}

export async function createAssignment(
  data: CreateAssignmentRequest,
): Promise<Assignment> {
  const response = await api.post<Assignment>("/assignments", data);

  return response.data;
}

export async function updateAssignment(
  id: number,
  data: UpdateAssignmentRequest,
): Promise<Assignment> {
  const response = await api.put<Assignment>(`/assignments/${id}`, data);

  return response.data;
}

export async function deleteAssignment(id: number): Promise<void> {
  await api.delete(`/assignments/${id}`);
}
