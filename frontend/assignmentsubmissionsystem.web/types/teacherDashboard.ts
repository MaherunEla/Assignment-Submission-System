export interface TeacherProfile {
  teacherId: number;
  userId: number;
  fullName: string;
  email: string;
}

export interface TeacherAssignment {
  id: number;
  title: string;
  description: string;
  subjectId: number;
  subject: string;
  academicClassId: number;
  academicClassName: string;
  deadline: string;
  maximumMarks: number;
  isPublished: boolean;
}

export interface TeacherSubmission {
  id: number;
  assignmentId: number;
  assignmentTitle: string;

  studentId: number;
  studentName: string;

  answer?: string | null;

  submittedAt: string;

  marks?: number | null;
  feedback?: string | null;

  status: "Submitted" | "Reviewed";

  fileName?: string | null;
  fileUrl?: string | null;
  fileContentType?: string | null;
  fileSize?: number | null;
}
