import api from "./axios";
import { Submission } from "@/types/submission";

export async function getMySubmissions(): Promise<Submission[]> {
  const response = await api.get<Submission[]>("/submissions/me");

  return response.data;
}

export async function getSubmission(id: number): Promise<Submission> {
  const response = await api.get<Submission>(`/submissions/${id}`);

  return response.data;
}

export interface CreateSubmissionRequest {
  assignmentId: number;
  answer?: string;
  file?: File;
}

export async function createSubmission(
  data: CreateSubmissionRequest,
): Promise<Submission> {
  const formData = new FormData();

  formData.append("AssignmentId", String(data.assignmentId));

  if (data.answer) {
    formData.append("Answer", data.answer);
  }

  if (data.file) {
    formData.append("File", data.file);
  }

  const response = await api.post<Submission>("/submissions", formData);

  return response.data;
}

export async function deleteSubmission(id: number): Promise<void> {
  await api.delete(`/submissions/${id}`);
}
