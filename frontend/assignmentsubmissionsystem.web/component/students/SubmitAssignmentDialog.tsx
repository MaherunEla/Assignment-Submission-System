"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { submissionSchema, SubmissionForm } from "@/lib/validations/submission";

import { StudentAssignment } from "@/types/studentAssignment";

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

import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SubmitAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  assignment?: StudentAssignment | null;

  onSubmit: (data: SubmissionForm, file?: File) => void;

  loading?: boolean;
}

export default function SubmitAssignmentDialog({
  open,
  onOpenChange,
  assignment,
  onSubmit,
  loading = false,
}: SubmitAssignmentDialogProps) {
  const [file, setFile] = useState<File | undefined>();

  const form = useForm<SubmissionForm>({
    resolver: zodResolver(submissionSchema),

    defaultValues: {
      answer: "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        answer: "",
      });

      setFile(undefined);
    }
  }, [open, assignment, form]);

  const handleSubmit = (data: SubmissionForm) => {
    onSubmit(data, file);
  };

  if (!assignment) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Submit Assignment</DialogTitle>
        </DialogHeader>

        <div className="space-y-1">
          <p className="font-medium">{assignment.title}</p>

          <p className="text-sm text-muted-foreground">
            Subject: {assignment.subject}
          </p>

          <p className="text-sm text-muted-foreground">
            Maximum Marks: {assignment.maximumMarks}
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-5"
          >
            {/* Answer */}

            <FormField
              control={form.control}
              name="answer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Answer</FormLabel>

                  <FormControl>
                    <Textarea
                      placeholder="Write your answer..."
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* File */}

            <div className="space-y-2">
              <FormLabel>Attachment</FormLabel>

              <Input
                type="file"
                onChange={(event) => {
                  const selectedFile = event.target.files?.[0];

                  setFile(selectedFile);
                }}
              />

              {file && (
                <p className="text-sm text-muted-foreground">
                  Selected: {file.name}
                </p>
              )}
            </div>

            {/* Buttons */}

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Submit Assignment"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
