export interface Student {
  id: number;
  userId: number;
  fullName: string;
  email: string;
  roleName: string;
  academicClassId: number;
  academicClassName: string;
}

export interface CreateStudentRequest {
  fullName: string;
  email: string;
  password: string;
  academicClassId: number;
}

export interface UpdateStudentRequest {
  fullName: string;
  email: string;
  academicClassId: number;
}

export interface AcademicClass {
  id: number;
  name: string;
}
