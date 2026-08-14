"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createSubjectSchema,
  updateSubjectSchema,
  CreateSubjectForm,
  UpdateSubjectForm,
} from "@/lib/validations/subject";

import { Subject } from "@/types/subject";
import { AcademicClass } from "@/types/class";

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

interface SubjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  subject?: Subject | null;

  classes: AcademicClass[];

  onSubmit: (data: CreateSubjectForm | UpdateSubjectForm) => void;

  loading?: boolean;
}

export default function SubjectDialog({
  open,
  onOpenChange,
  subject,
  classes,
  onSubmit,
  loading = false,
}: SubjectDialogProps) {
  const isEditing = !!subject;

  const form = useForm<CreateSubjectForm | UpdateSubjectForm>({
    resolver: zodResolver(
      isEditing ? updateSubjectSchema : createSubjectSchema,
    ),

    defaultValues: isEditing
      ? {
          name: subject.name,
          academicClassId: subject.academicClassId,
        }
      : {
          name: "",
          academicClassId: 0,
        },
  });

  useEffect(() => {
    if (!open) return;

    if (subject) {
      form.reset({
        name: subject.name,
        academicClassId: subject.academicClassId,
      });
    } else {
      form.reset({
        name: "",
        academicClassId: 0,
      });
    }
  }, [subject, open, form]);

  const handleSubmit = (data: CreateSubjectForm | UpdateSubjectForm) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Subject" : "Create Subject"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-5"
          >
            {/* Subject Name */}

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject Name</FormLabel>

                  <FormControl>
                    <Input placeholder="Enter subject name" {...field} />
                  </FormControl>

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
                    ? "Update Subject"
                    : "Create Subject"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
