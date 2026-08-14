export interface Teacher {
  id: number;
  userId: number;
  fullName: string;
  email: string;
  roleName: string;
}

export interface CreateTeacherRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface UpdateTeacherRequest {
  fullName: string;
  email: string;
}
