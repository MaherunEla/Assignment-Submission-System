"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createStudentSchema,
  updateStudentSchema,
  CreateStudentForm,
  UpdateStudentForm,
} from "@/lib/validations/student";

import { Student, AcademicClass } from "@/types/student";

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

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  student?: Student | null;

  classes: AcademicClass[];

  onSubmit: (data: CreateStudentForm | UpdateStudentForm) => void;

  loading?: boolean;
}

export default function StudentDialog({
  open,
  onOpenChange,
  student,
  classes,
  onSubmit,
  loading = false,
}: StudentDialogProps) {
  const isEditing = !!student;

  const form = useForm<CreateStudentForm | UpdateStudentForm>({
    resolver: zodResolver(
      isEditing ? updateStudentSchema : createStudentSchema,
    ),

    defaultValues: isEditing
      ? {
          fullName: student.fullName,
          email: student.email,
          academicClassId: student.academicClassId,
        }
      : {
          fullName: "",
          email: "",
          password: "",
          academicClassId: 0,
        },
  });

  useEffect(() => {
    if (!open) return;

    if (student) {
      form.reset({
        fullName: student.fullName,
        email: student.email,
        academicClassId: student.academicClassId,
      });
    } else {
      form.reset({
        fullName: "",
        email: "",
        password: "",
        academicClassId: 0,
      });
    }
  }, [student, open, form]);

  const handleSubmit = (data: CreateStudentForm | UpdateStudentForm) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Student" : "Create Student"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-5"
          >
            {/* Full Name */}

            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>

                  <FormControl>
                    <Input placeholder="Enter full name" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>

                  <FormControl>
                    <Input
                      type="email"
                      placeholder="student@example.com"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}

            {!isEditing && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>

                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter password"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Academic Class */}

            <FormField
              control={form.control}
              name="academicClassId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Academic Class</FormLabel>

                  <Select
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(value) => field.onChange(Number(value))}
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
                    ? "Update Student"
                    : "Create Student"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
