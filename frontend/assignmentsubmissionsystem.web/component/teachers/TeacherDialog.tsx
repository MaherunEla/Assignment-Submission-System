"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createTeacherSchema,
  updateTeacherSchema,
  CreateTeacherForm,
  UpdateTeacherForm,
} from "@/lib/validations/teacher";

import { Teacher } from "@/types/teacher";

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

interface TeacherDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  teacher?: Teacher | null;

  onSubmit: (data: CreateTeacherForm | UpdateTeacherForm) => void;

  loading?: boolean;
}

export default function TeacherDialog({
  open,
  onOpenChange,
  teacher,
  onSubmit,
  loading = false,
}: TeacherDialogProps) {
  const isEditing = !!teacher;

  const form = useForm<CreateTeacherForm | UpdateTeacherForm>({
    resolver: zodResolver(
      isEditing ? updateTeacherSchema : createTeacherSchema,
    ),

    defaultValues: isEditing
      ? {
          fullName: teacher.fullName,
          email: teacher.email,
        }
      : {
          fullName: "",
          email: "",
          password: "",
        },
  });

  useEffect(() => {
    if (!open) return;

    if (teacher) {
      form.reset({
        fullName: teacher.fullName,
        email: teacher.email,
      });
    } else {
      form.reset({
        fullName: "",
        email: "",
        password: "",
      });
    }
  }, [teacher, open, form]);

  const handleSubmit = (data: CreateTeacherForm | UpdateTeacherForm) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Teacher" : "Create Teacher"}
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
                      placeholder="teacher@example.com"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password - Create Only */}

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
                    ? "Update Teacher"
                    : "Create Teacher"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
