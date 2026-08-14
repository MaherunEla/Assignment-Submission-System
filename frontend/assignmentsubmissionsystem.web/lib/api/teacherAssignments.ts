import api from "./axios";

import {
  TeacherAssignment,
  CreateTeacherAssignmentRequest,
  UpdateTeacherAssignmentRequest,
} from "@/types/teacher-assignment";

export async function getTeacherAssignments(): Promise<TeacherAssignment[]> {
  const response = await api.get<TeacherAssignment[]>("/teacher-assignments");

  return response.data;
}

export async function getTeacherAssignment(
  id: number,
): Promise<TeacherAssignment> {
  const response = await api.get<TeacherAssignment>(
    `/teacher-assignments/${id}`,
  );

  return response.data;
}

export async function createTeacherAssignment(
  data: CreateTeacherAssignmentRequest,
): Promise<TeacherAssignment> {
  const response = await api.post<TeacherAssignment>(
    "/teacher-assignments",
    data,
  );

  return response.data;
}

export async function updateTeacherAssignment(
  id: number,
  data: UpdateTeacherAssignmentRequest,
): Promise<TeacherAssignment> {
  const response = await api.put<TeacherAssignment>(
    `/teacher-assignments/${id}`,
    data,
  );

  return response.data;
}

export async function deleteTeacherAssignment(id: number): Promise<void> {
  await api.delete(`/teacher-assignments/${id}`);
}
