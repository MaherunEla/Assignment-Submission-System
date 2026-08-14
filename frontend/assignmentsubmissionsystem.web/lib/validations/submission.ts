import { z } from "zod";

export const submissionSchema = z.object({
  answer: z
    .string()
    .max(5000, "Answer cannot exceed 5000 characters")
    .optional(),
});

export type SubmissionForm = z.infer<typeof submissionSchema>;
