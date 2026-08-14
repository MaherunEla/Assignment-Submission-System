import api from "@/lib/api/axios";
import {
  Student,
  CreateStudentRequest,
  UpdateStudentRequest,
  AcademicClass,
} from "@/types/student";

export async function getStudents(): Promise<Student[]> {
  const response = await api.get<Student[]>("/students");

  return response.data;
}

export async function getStudent(id: number): Promise<Student> {
  const response = await api.get<Student>(`/students/${id}`);

  return response.data;
}

export async function createStudent(
  data: CreateStudentRequest,
): Promise<Student> {
  const response = await api.post<Student>("/students", data);

  return response.data;
}

export async function updateStudent(
  id: number,
  data: UpdateStudentRequest,
): Promise<Student> {
  const response = await api.put<Student>(`/students/${id}`, data);

  return response.data;
}

export async function deleteStudent(id: number): Promise<void> {
  await api.delete(`/students/${id}`);
}

export async function getAcademicClasses(): Promise<AcademicClass[]> {
  const response = await api.get<AcademicClass[]>("/academic-classes");

  return response.data;
}
