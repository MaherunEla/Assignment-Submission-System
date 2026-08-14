"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createAssignmentSchema,
  updateAssignmentSchema,
  CreateAssignmentForm,
  UpdateAssignmentForm,
} from "@/lib/validations/assignment";

import { Assignment } from "@/types/assignment";
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

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  assignment?: Assignment | null;

  teachers?: Teacher[];
  classes: AcademicClass[];
  subjects: Subject[];

  onSubmit: (data: CreateAssignmentForm | UpdateAssignmentForm) => void;

  loading?: boolean;
}

export default function AssignmentDialog({
  open,
  onOpenChange,
  assignment,
  teachers,
  classes,
  subjects,
  onSubmit,
  loading = false,
}: AssignmentDialogProps) {
  const isEditing = !!assignment;

  const form = useForm<CreateAssignmentForm | UpdateAssignmentForm>({
    resolver: zodResolver(
      isEditing ? updateAssignmentSchema : createAssignmentSchema,
    ),

    defaultValues: isEditing
      ? {
          title: assignment.title,
          description: assignment.description,
          deadline: assignment.deadline.slice(0, 16),
          maximumMarks: assignment.maximumMarks,
          isPublished: assignment.isPublished,
          teacherId: assignment.teacherId,
          academicClassId: assignment.academicClassId,
          subjectId: assignment.subjectId,
        }
      : {
          title: "",
          description: "",
          deadline: "",
          maximumMarks: 100,
          isPublished: false,
          teacherId: 0,
          academicClassId: 0,
          subjectId: 0,
        },
  });

  useEffect(() => {
    if (!open) return;

    if (assignment) {
      form.reset({
        title: assignment.title,
        description: assignment.description,
        deadline: assignment.deadline.slice(0, 16),
        maximumMarks: assignment.maximumMarks,
        isPublished: assignment.isPublished,
        teacherId: assignment.teacherId,
        academicClassId: assignment.academicClassId,
        subjectId: assignment.subjectId,
      });
    } else {
      form.reset({
        title: "",
        description: "",
        deadline: "",
        maximumMarks: 100,
        isPublished: false,
        teacherId: 0,
        academicClassId: 0,
        subjectId: 0,
      });
    }
  }, [assignment, open, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Assignment" : "Create Assignment"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>

                  <FormControl>
                    <Input placeholder="Assignment title" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>

                  <FormControl>
                    <Textarea placeholder="Assignment description" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deadline</FormLabel>

                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maximumMarks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Marks</FormLabel>

                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={1000}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {teachers && (
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
                          <SelectItem
                            key={teacher.id}
                            value={String(teacher.id)}
                          >
                            {teacher.fullName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

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
                      {classes.map((item) => (
                        <SelectItem key={item.id} value={String(item.id)}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subjectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>

                  <Select
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(value) => field.onChange(Number(value))}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={String(subject.id)}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isPublished"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Publish</FormLabel>

                  <Select
                    value={field.value ? "true" : "false"}
                    onValueChange={(value) => field.onChange(value === "true")}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      <SelectItem value="false">Draft</SelectItem>

                      <SelectItem value="true">Published</SelectItem>
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

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
                    : "Create Assignment"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
