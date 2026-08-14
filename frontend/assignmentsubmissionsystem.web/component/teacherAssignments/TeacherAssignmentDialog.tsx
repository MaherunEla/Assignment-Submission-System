"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createTeacherAssignmentSchema,
  updateTeacherAssignmentSchema,
  CreateTeacherAssignmentForm,
  UpdateTeacherAssignmentForm,
} from "@/lib/validations/teacherAssignment";

import { TeacherAssignment } from "@/types/teacher-assignment";
import { Teacher } from "@/types/teacher";
import { AcademicClass } from "@/types/class";
import { Subject } from "@/types/subject";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TeacherAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  teacherAssignment?: TeacherAssignment | null;

  teachers: Teacher[];
  classes: AcademicClass[];
  subjects: Subject[];

  onSubmit: (
    data: CreateTeacherAssignmentForm | UpdateTeacherAssignmentForm,
  ) => void;

  loading?: boolean;
}

export default function TeacherAssignmentDialog({
  open,
  onOpenChange,
  teacherAssignment,
  teachers,
  classes,
  subjects,
  onSubmit,
  loading = false,
}: TeacherAssignmentDialogProps) {
  const isEditing = !!teacherAssignment;

  const form = useForm<
    CreateTeacherAssignmentForm | UpdateTeacherAssignmentForm
  >({
    resolver: zodResolver(
      isEditing ? updateTeacherAssignmentSchema : createTeacherAssignmentSchema,
    ),

    defaultValues: isEditing
      ? {
          teacherId: teacherAssignment.teacherId,
          academicClassId: teacherAssignment.academicClassId,
          subjectId: teacherAssignment.subjectId,
        }
      : {
          teacherId: 0,
          academicClassId: 0,
          subjectId: 0,
        },
  });

  useEffect(() => {
    if (!open) return;

    if (teacherAssignment) {
      form.reset({
        teacherId: teacherAssignment.teacherId,
        academicClassId: teacherAssignment.academicClassId,
        subjectId: teacherAssignment.subjectId,
      });
    } else {
      form.reset({
        teacherId: 0,
        academicClassId: 0,
        subjectId: 0,
      });
    }
  }, [teacherAssignment, open, form]);

  const handleSubmit = (
    data: CreateTeacherAssignmentForm | UpdateTeacherAssignmentForm,
  ) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? "Edit Teacher Assignment"
              : "Create Teacher Assignment"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-5"
          >
            {/* Teacher */}

            <FormField
              control={form.control}
              name="teacherId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teacher</FormLabel>

                  <Select
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(value) => field.onChange(Number(value))}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select teacher" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {teachers.map((teacher) => (
                        <SelectItem key={teacher.id} value={String(teacher.id)}>
                          {teacher.fullName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Academic Class */}

            <FormField
              control={form.control}
              name="academicClassId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Academic Class</FormLabel>

                  <Select
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(value) => {
                      field.onChange(Number(value));

                      // Reset subject when class changes
                      form.setValue("subjectId", 0);
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {classes.map((academicClass) => (
                        <SelectItem
                          key={academicClass.id}
                          value={String(academicClass.id)}
                        >
                          {academicClass.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Subject */}

            <FormField
              control={form.control}
              name="subjectId"
              render={({ field }) => {
                const selectedClassId = form.watch("academicClassId");

                const filteredSubjects = subjects.filter(
                  (subject) => subject.academicClassId === selectedClassId,
                );

                return (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>

                    <Select
                      value={field.value ? String(field.value) : ""}
                      onValueChange={(value) => field.onChange(Number(value))}
                      disabled={!selectedClassId}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              selectedClassId
                                ? "Select subject"
                                : "Select class first"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {filteredSubjects.map((subject) => (
                          <SelectItem
                            key={subject.id}
                            value={String(subject.id)}
                          >
                            {subject.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            {/* Buttons */}

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={loading}>
                {loading
                  ? "Saving..."
                  : isEditing
                    ? "Update Assignment"
                    : "Assign Teacher"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
