export enum SubmissionStatus {
  Submitted = "Submitted",
  Reviewed = "Reviewed",
}

export interface Submission {
  id: number;

  assignmentId: number;
  assignmentTitle: string;

  studentId: number;
  studentName: string;

  answer: string | null;
  submittedAt: string;

  marks: number | null;
  feedback: string | null;

  status: SubmissionStatus;

  fileName: string | null;
  fileUrl: string | null;
  fileContentType: string | null;
  fileSize: number | null;
}
