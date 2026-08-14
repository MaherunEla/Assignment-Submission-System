import api from "./axios";
import {
  Teacher,
  CreateTeacherRequest,
  UpdateTeacherRequest,
} from "@/types/teacher";

import {
  TeacherProfile,
  TeacherAssignment,
  TeacherSubmission,
} from "@/types/teacherDashboard";

export async function getTeachers(): Promise<Teacher[]> {
  const response = await api.get<Teacher[]>("/teachers");

  return response.data;
}

export async function getTeacher(id: number): Promise<Teacher> {
  const response = await api.get<Teacher>(`/teachers/${id}`);

  return response.data;
}

export async function createTeacher(
  data: CreateTeacherRequest,
): Promise<Teacher> {
  const response = await api.post<Teacher>("/teachers", data);

  return response.data;
}

export async function updateTeacher(
  id: number,
  data: UpdateTeacherRequest,
): Promise<Teacher> {
  const response = await api.put<Teacher>(`/teachers/${id}`, data);

  return response.data;
}

export async function deleteTeacher(id: number): Promise<void> {
  await api.delete(`/teachers/${id}`);
}

export async function getMyTeacherProfile(): Promise<TeacherProfile> {
  const response = await api.get<TeacherProfile>("/teachers/me");

  return response.data;
}

export async function getMyTeacherAssignments(): Promise<TeacherAssignment[]> {
  const response = await api.get<TeacherAssignment[]>(
    "/teachers/me/assignments",
  );

  return response.data;
}

export async function getAssignmentSubmissions(
  assignmentId: number,
): Promise<TeacherSubmission[]> {
  const response = await api.get<TeacherSubmission[]>(
    `/submissions/assignment/${assignmentId}`,
  );

  return response.data;
}

export async function getSubmission(id: number): Promise<TeacherSubmission> {
  const response = await api.get<TeacherSubmission>(`/submissions/${id}`);

  return response.data;
}

export interface GradeSubmissionRequest {
  marks: number;
  feedback?: string;
}

export async function gradeSubmission(
  id: number,
  data: GradeSubmissionRequest,
): Promise<TeacherSubmission> {
  const response = await api.put<TeacherSubmission>(
    `/submissions/${id}/grade`,
    data,
  );

  return response.data;
}
