import api from "./axios";

import {
  Subject,
  CreateSubjectRequest,
  UpdateSubjectRequest,
} from "@/types/subject";

export async function getSubjects(): Promise<Subject[]> {
  const response = await api.get<Subject[]>("/subjects");

  return response.data;
}

export async function getSubject(id: number): Promise<Subject> {
  const response = await api.get<Subject>(`/subjects/${id}`);

  return response.data;
}

export async function createSubject(
  data: CreateSubjectRequest,
): Promise<Subject> {
  const response = await api.post<Subject>("/subjects", data);

  return response.data;
}

export async function updateSubject(
  id: number,
  data: UpdateSubjectRequest,
): Promise<Subject> {
  const response = await api.put<Subject>(`/subjects/${id}`, data);

  return response.data;
}

export async function deleteSubject(id: number): Promise<void> {
  await api.delete(`/subjects/${id}`);
}
