export interface Assignment {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  deadline: string;
  maximumMarks: number;
  isPublished: boolean;

  teacherId: number;
  teacherName: string;

  academicClassId: number;
  academicClassName: string;

  subjectId: number;
  subjectName: string;
}

export interface CreateAssignmentRequest {
  title: string;
  description: string;
  deadline: string;
  maximumMarks: number;
  isPublished: boolean;
  teacherId: number;
  academicClassId: number;
  subjectId: number;
}

export interface UpdateAssignmentRequest {
  title: string;
  description: string;
  deadline: string;
  maximumMarks: number;
  isPublished: boolean;
  teacherId: number;
  academicClassId: number;
  subjectId: number;
}
