import { z } from "zod";

export const createStudentSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),

  email: z.string().email("Please enter a valid email address"),

  password: z.string().min(6, "Password must be at least 6 characters"),

  academicClassId: z.number().min(1, "Please select a class"),
});

export const updateStudentSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),

  email: z.string().email("Please enter a valid email address"),

  academicClassId: z.number().min(1, "Please select a class"),
});

export type CreateStudentForm = z.infer<typeof createStudentSchema>;

export type UpdateStudentForm = z.infer<typeof updateStudentSchema>;
