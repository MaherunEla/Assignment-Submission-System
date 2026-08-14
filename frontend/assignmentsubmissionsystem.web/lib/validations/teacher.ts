import { z } from "zod";

// CREATE TEACHER
export const createTeacherSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters.")
    .max(100, "Full name must not exceed 100 characters.")
    .trim(),

  email: z
    .string()
    .email("Please enter a valid email address.")
    .max(150, "Email must not exceed 150 characters.")
    .trim(),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters.")
    .max(100, "Password must not exceed 100 characters."),
});

// UPDATE TEACHER
export const updateTeacherSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters.")
    .max(100, "Full name must not exceed 100 characters.")
    .trim(),

  email: z
    .string()
    .email("Please enter a valid email address.")
    .max(150, "Email must not exceed 150 characters.")
    .trim(),
});

export type CreateTeacherForm = z.infer<typeof createTeacherSchema>;

export type UpdateTeacherForm = z.infer<typeof updateTeacherSchema>;
