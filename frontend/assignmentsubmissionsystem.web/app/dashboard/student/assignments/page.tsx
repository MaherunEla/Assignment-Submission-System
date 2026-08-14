"use client";

import { useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getMyAssignments } from "@/lib/api/studentAssignments";

import {
  createSubmission,
  CreateSubmissionRequest,
} from "@/lib/api/submissions";

import { SubmissionForm } from "@/lib/validations/submission";

import { StudentAssignment } from "@/types/studentAssignment";

import SubmitAssignmentDialog from "@/component/students/SubmitAssignmentDialog";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function StudentAssignmentsPage() {
  const queryClient = useQueryClient();

  const [dialogOpen, setDialogOpen] = useState(false);

  const [selectedAssignment, setSelectedAssignment] =
    useState<StudentAssignment | null>(null);

  // =============================================
  // GET ASSIGNMENTS
  // =============================================

  const {
    data: assignments = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["my-assignments"],
    queryFn: getMyAssignments,
  });

  // =============================================
  // SUBMIT
  // =============================================

  const submitMutation = useMutation({
    mutationFn: createSubmission,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["my-submissions"],
      });

      setDialogOpen(false);
      setSelectedAssignment(null);
    },
  });

  // =============================================
  // SUBMIT HANDLER
  // =============================================

  const handleSubmit = (data: SubmissionForm, file?: File) => {
    if (!selectedAssignment) {
      return;
    }

    const request: CreateSubmissionRequest = {
      assignmentId: selectedAssignment.id,
      answer: data.answer,
      file,
    };

    submitMutation.mutate(request);
  };

  // =============================================
  // LOADING
  // =============================================

  if (isLoading) {
    return <div className="py-20 text-center">Loading assignments...</div>;
  }

  // =============================================
  // ERROR
  // =============================================

  if (isError) {
    return <div className="text-destructive">Failed to load assignments.</div>;
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div>
        <h1 className="text-2xl font-bold">My Assignments</h1>

        <p className="text-muted-foreground">
          View assignments assigned to your class.
        </p>
      </div>

      {/* EMPTY */}

      {assignments.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No assignments available.
          </CardContent>
        </Card>
      )}

      {/* ASSIGNMENTS */}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {assignments.map((assignment) => (
          <Card key={assignment.id}>
            <CardContent className="space-y-4 p-5">
              <div>
                <h2 className="text-lg font-semibold">{assignment.title}</h2>

                <p className="text-sm text-muted-foreground">
                  {assignment.subject}
                </p>
              </div>

              <p className="text-sm">{assignment.description}</p>

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">
                  {assignment.maximumMarks} Marks
                </Badge>

                <Badge variant="outline">
                  Due: {new Date(assignment.deadline).toLocaleDateString()}
                </Badge>
              </div>

              <Button
                className="w-full"
                onClick={() => {
                  setSelectedAssignment(assignment);

                  setDialogOpen(true);
                }}
              >
                Submit Assignment
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* SUBMIT DIALOG */}

      <SubmitAssignmentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        assignment={selectedAssignment}
        onSubmit={handleSubmit}
        loading={submitMutation.isPending}
      />
    </div>
  );
}
