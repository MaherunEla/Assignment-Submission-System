import { z } from "zod";

export const createTeacherAssignmentSchema = z.object({
  teacherId: z.number().int().positive("Please select a teacher."),

  academicClassId: z
    .number()
    .int()
    .positive("Please select an academic class."),

  subjectId: z.number().int().positive("Please select a subject."),
});

export const updateTeacherAssignmentSchema = z.object({
  teacherId: z.number().int().positive("Please select a teacher."),

  academicClassId: z
    .number()
    .int()
    .positive("Please select an academic class."),

  subjectId: z.number().int().positive("Please select a subject."),
});

export type CreateTeacherAssignmentForm = z.infer<
  typeof createTeacherAssignmentSchema
>;

export type UpdateTeacherAssignmentForm = z.infer<
  typeof updateTeacherAssignmentSchema
>;
