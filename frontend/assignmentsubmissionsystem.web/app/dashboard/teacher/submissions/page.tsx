"use client";

import { useState } from "react";

import { useQuery } from "@tanstack/react-query";

import {
  getAssignmentSubmissions,
  getMyTeacherAssignments,
} from "@/lib/api/teachers";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";

import GradeSubmissionDialog from "@/component/teachers/GradeSubmissionDialog";

import { TeacherSubmission } from "@/types/teacherDashboard";

export default function TeacherSubmissionsPage() {
  const [selectedAssignment, setSelectedAssignment] = useState<number | null>(
    null,
  );

  const [search, setSearch] = useState("");

  const [gradeOpen, setGradeOpen] = useState(false);

  const [selectedSubmission, setSelectedSubmission] =
    useState<TeacherSubmission | null>(null);

  // ---------------------------------------------
  // GET ASSIGNMENTS
  // ---------------------------------------------

  const { data: assignments = [], isLoading: assignmentsLoading } = useQuery({
    queryKey: ["teacher-assignments"],
    queryFn: getMyTeacherAssignments,
  });

  // ---------------------------------------------
  // GET SUBMISSIONS
  // ---------------------------------------------

  const {
    data: submissions = [],
    isLoading: submissionsLoading,
    isError,
  } = useQuery({
    queryKey: ["teacher-submissions", selectedAssignment],

    queryFn: () => getAssignmentSubmissions(selectedAssignment!),

    enabled: selectedAssignment !== null,
  });

  const filteredSubmissions = submissions.filter((submission) =>
    submission.studentName.toLowerCase().includes(search.toLowerCase()),
  );

  // ---------------------------------------------
  // LOADING
  // ---------------------------------------------

  if (assignmentsLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        Loading assignments...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div>
        <h1 className="text-2xl font-bold">Submissions</h1>

        <p className="text-muted-foreground">
          Review and grade student submissions.
        </p>
      </div>

      {/* SELECT ASSIGNMENT */}

      <Card>
        <CardHeader>
          <CardTitle>Select Assignment</CardTitle>
        </CardHeader>

        <CardContent>
          <Select
            value={selectedAssignment ? String(selectedAssignment) : ""}
            onValueChange={(value) => {
              setSelectedAssignment(Number(value));
              setSearch("");
            }}
          >
            <SelectTrigger className="max-w-md">
              <SelectValue placeholder="Select assignment" />
            </SelectTrigger>

            <SelectContent>
              {assignments.map((assignment) => (
                <SelectItem key={assignment.id} value={String(assignment.id)}>
                  {assignment.title} — {assignment.academicClassName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* SUBMISSIONS */}

      {selectedAssignment !== null && (
        <Card>
          <CardHeader>
            <CardTitle>Student Submissions</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <Input
              placeholder="Search student..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />

            {submissionsLoading ? (
              <div className="py-10 text-center">Loading submissions...</div>
            ) : isError ? (
              <div className="text-destructive">
                Failed to load submissions.
              </div>
            ) : (
              <div className="w-full overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>

                      <TableHead>Submitted</TableHead>

                      <TableHead>File</TableHead>

                      <TableHead>Marks</TableHead>

                      <TableHead>Status</TableHead>

                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredSubmissions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="py-10 text-center">
                          No submissions found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredSubmissions.map((submission) => (
                        <TableRow key={submission.id}>
                          <TableCell className="font-medium">
                            {submission.studentName}
                          </TableCell>

                          <TableCell>
                            {new Date(submission.submittedAt).toLocaleString()}
                          </TableCell>

                          <TableCell>
                            {submission.fileName ? (
                              <a
                                href={submission.fileUrl ?? "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline"
                              >
                                {submission.fileName}
                              </a>
                            ) : (
                              "No file"
                            )}
                          </TableCell>

                          <TableCell>
                            {submission.marks ?? "Not graded"}
                          </TableCell>

                          <TableCell>
                            <Badge
                              variant={
                                submission.status === "Reviewed"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {submission.status}
                            </Badge>
                          </TableCell>

                          <TableCell>
                            <div className="flex justify-end">
                              <button
                                type="button"
                                className="text-sm underline"
                                onClick={() => {
                                  setSelectedSubmission(submission);

                                  setGradeOpen(true);
                                }}
                              >
                                Grade
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* GRADE DIALOG */}

      <GradeSubmissionDialog
        open={gradeOpen}
        onOpenChange={setGradeOpen}
        submission={selectedSubmission}
      />
    </div>
  );
}
