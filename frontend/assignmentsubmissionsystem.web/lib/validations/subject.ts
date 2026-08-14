import { z } from "zod";

export const createSubjectSchema = z.object({
  name: z
    .string()
    .min(2, "Subject name must be at least 2 characters.")
    .max(100, "Subject name must not exceed 100 characters."),

  academicClassId: z
    .number()
    .int()
    .positive("Please select an academic class."),
});

export const updateSubjectSchema = z.object({
  name: z
    .string()
    .min(2, "Subject name must be at least 2 characters.")
    .max(100, "Subject name must not exceed 100 characters."),

  academicClassId: z
    .number()
    .int()
    .positive("Please select an academic class."),
});

export type CreateSubjectForm = z.infer<typeof createSubjectSchema>;

export type UpdateSubjectForm = z.infer<typeof updateSubjectSchema>;
