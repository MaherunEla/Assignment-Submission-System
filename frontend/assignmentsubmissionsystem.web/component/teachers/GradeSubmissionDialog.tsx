"use client";

import { useEffect } from "react";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  gradeSubmissionSchema,
  GradeSubmissionForm,
} from "@/lib/validations/gradeSubmission";

import { gradeSubmission } from "@/lib/api/teachers";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { TeacherSubmission } from "@/types/teacherDashboard";

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

interface GradeSubmissionDialogProps {
  open: boolean;

  onOpenChange: (open: boolean) => void;

  submission?: TeacherSubmission | null;
}

export default function GradeSubmissionDialog({
  open,
  onOpenChange,
  submission,
}: GradeSubmissionDialogProps) {
  const queryClient = useQueryClient();

  const form = useForm<GradeSubmissionForm>({
    resolver: zodResolver(gradeSubmissionSchema),

    defaultValues: {
      marks: 0,
      feedback: "",
    },
  });

  useEffect(() => {
    if (!open || !submission) return;

    form.reset({
      marks: submission.marks ?? 0,
      feedback: submission.feedback ?? "",
    });
  }, [open, submission, form]);

  const mutation = useMutation({
    mutationFn: (data: GradeSubmissionForm) =>
      gradeSubmission(submission!.id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teacher-submissions"],
      });

      onOpenChange(false);
    },
  });

  const handleSubmit = (data: GradeSubmissionForm) => {
    mutation.mutate(data);
  };

  if (!submission) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Grade Submission</DialogTitle>
        </DialogHeader>

        <div className="mb-4 rounded-lg border p-4">
          <p className="font-medium">{submission.studentName}</p>

          <p className="text-sm text-muted-foreground">
            {submission.assignmentTitle}
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-5"
          >
            {/* MARKS */}

            <FormField
              control={form.control}
              name="marks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marks</FormLabel>

                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            {/* FEEDBACK */}

            <FormField
              control={form.control}
              name="feedback"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Feedback</FormLabel>

                  <FormControl>
                    <Textarea
                      placeholder="Write feedback..."
                      rows={4}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* BUTTONS */}

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Saving..." : "Save Grade"}
              </Button>
            </div>

            {mutation.isError && (
              <p className="text-sm text-destructive">Failed to save grade.</p>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
