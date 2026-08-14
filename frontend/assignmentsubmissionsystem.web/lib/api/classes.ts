import api from "./axios";

import {
  AcademicClass,
  CreateAcademicClassRequest,
  UpdateAcademicClassRequest,
} from "@/types/class";

export async function getAcademicClasses(): Promise<AcademicClass[]> {
  const response = await api.get<AcademicClass[]>("/academic-classes");

  return response.data;
}

export async function getAcademicClass(id: number): Promise<AcademicClass> {
  const response = await api.get<AcademicClass>(`/academic-classes/${id}`);

  return response.data;
}

export async function createAcademicClass(
  data: CreateAcademicClassRequest,
): Promise<AcademicClass> {
  const response = await api.post<AcademicClass>("/academic-classes", data);

  return response.data;
}

export async function updateAcademicClass(
  id: number,
  data: UpdateAcademicClassRequest,
): Promise<AcademicClass> {
  const response = await api.put<AcademicClass>(
    `/academic-classes/${id}`,
    data,
  );

  return response.data;
}

export async function deleteAcademicClass(id: number): Promise<void> {
  await api.delete(`/academic-classes/${id}`);
}
