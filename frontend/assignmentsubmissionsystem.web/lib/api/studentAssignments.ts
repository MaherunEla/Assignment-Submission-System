import api from "./axios";
import { StudentAssignment } from "@/types/studentAssignment";

export async function getMyAssignments(): Promise<StudentAssignment[]> {
  const response = await api.get<StudentAssignment[]>(
    "/students/me/assignments",
  );

  return response.data;
}
