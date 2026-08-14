import { z } from "zod";

export const createAcademicClassSchema = z.object({
  name: z
    .string()
    .min(2, "Class name must be at least 2 characters.")
    .max(100, "Class name must not exceed 100 characters."),
});

export const updateAcademicClassSchema = z.object({
  name: z
    .string()
    .min(2, "Class name must be at least 2 characters.")
    .max(100, "Class name must not exceed 100 characters."),
});

export type CreateAcademicClassForm = z.infer<typeof createAcademicClassSchema>;

export type UpdateAcademicClassForm = z.infer<typeof updateAcademicClassSchema>;
