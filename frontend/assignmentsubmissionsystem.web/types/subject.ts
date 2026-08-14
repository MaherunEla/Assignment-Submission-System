export interface Subject {
  id: number;
  name: string;

  academicClassId: number;
  academicClassName: string;
}

export interface CreateSubjectRequest {
  name: string;
  academicClassId: number;
}

export interface UpdateSubjectRequest {
  name: string;
  academicClassId: number;
}
