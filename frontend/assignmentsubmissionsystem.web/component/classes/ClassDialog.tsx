"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createAcademicClassSchema,
  updateAcademicClassSchema,
  CreateAcademicClassForm,
  UpdateAcademicClassForm,
} from "@/lib/validations/class";

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

interface ClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  academicClass?: AcademicClass | null;

  onSubmit: (data: CreateAcademicClassForm | UpdateAcademicClassForm) => void;

  loading?: boolean;
}

export default function ClassDialog({
  open,
  onOpenChange,
  academicClass,
  onSubmit,
  loading = false,
}: ClassDialogProps) {
  const isEditing = !!academicClass;

  const form = useForm<CreateAcademicClassForm | UpdateAcademicClassForm>({
    resolver: zodResolver(
      isEditing ? updateAcademicClassSchema : createAcademicClassSchema,
    ),

    defaultValues: isEditing
      ? {
          name: academicClass.name,
        }
      : {
          name: "",
        },
  });

  useEffect(() => {
    if (!open) return;

    if (academicClass) {
      form.reset({
        name: academicClass.name,
      });
    } else {
      form.reset({
        name: "",
      });
    }
  }, [academicClass, open, form]);

  const handleSubmit = (
    data: CreateAcademicClassForm | UpdateAcademicClassForm,
  ) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Class" : "Create Class"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-5"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class Name</FormLabel>

                  <FormControl>
                    <Input placeholder="e.g. Class 7" {...field} />
                  </FormControl>

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
                    ? "Update Class"
                    : "Create Class"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
