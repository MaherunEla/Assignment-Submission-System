import { z } from "zod";

export const createAssignmentSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),

  description: z.string().min(1, "Description is required"),

  deadline: z.string().min(1, "Deadline is required"),

  maximumMarks: z
    .number()
    .min(1, "Maximum marks must be at least 1")
    .max(1000, "Maximum marks cannot exceed 1000"),

  isPublished: z.boolean(),

  teacherId: z.number().min(1, "Teacher is required"),

  academicClassId: z.number().min(1, "Academic class is required"),

  subjectId: z.number().min(1, "Subject is required"),
});

export const updateAssignmentSchema = createAssignmentSchema;

export type CreateAssignmentForm = z.infer<typeof createAssignmentSchema>;

export type UpdateAssignmentForm = z.infer<typeof updateAssignmentSchema>;
