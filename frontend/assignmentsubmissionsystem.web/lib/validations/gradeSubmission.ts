import { z } from "zod";

export const gradeSubmissionSchema = z.object({
  marks: z.number().min(0, "Marks cannot be negative."),

  feedback: z
    .string()
    .max(1000, "Feedback cannot exceed 1000 characters.")
    .optional(),
});

export type GradeSubmissionForm = z.infer<typeof gradeSubmissionSchema>;
