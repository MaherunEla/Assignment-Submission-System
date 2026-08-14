export interface TeacherAssignment {
  id: number;

  teacherId: number;
  teacherName: string;

  academicClassId: number;
  academicClassName: string;

  subjectId: number;
  subjectName: string;
}

export interface CreateTeacherAssignmentRequest {
  teacherId: number;
  academicClassId: number;
  subjectId: number;
}

export interface UpdateTeacherAssignmentRequest {
  teacherId: number;
  academicClassId: number;
  subjectId: number;
}
