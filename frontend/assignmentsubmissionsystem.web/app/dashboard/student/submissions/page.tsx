"use client";

import { useQuery } from "@tanstack/react-query";

import { getMySubmissions } from "@/lib/api/submissions";

import { Card, CardContent } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function StudentSubmissionsPage() {
  const {
    data: submissions = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["my-submissions"],
    queryFn: getMySubmissions,
  });

  if (isLoading) {
    return <div className="py-20 text-center">Loading submissions...</div>;
  }

  if (isError) {
    return <div className="text-destructive">Failed to load submissions.</div>;
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div>
        <h1 className="text-2xl font-bold">My Submissions</h1>

        <p className="text-muted-foreground">
          View your submitted assignments and grades.
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Assignment</TableHead>

                  <TableHead>Submitted</TableHead>

                  <TableHead>Status</TableHead>

                  <TableHead>Marks</TableHead>

                  <TableHead>File</TableHead>

                  <TableHead>Feedback</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {submissions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-10 text-center">
                      No submissions yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  submissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-medium">
                        {submission.assignmentTitle}
                      </TableCell>

                      <TableCell>
                        {new Date(submission.submittedAt).toLocaleString()}
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
                        {submission.marks !== null
                          ? submission.marks
                          : "Not graded"}
                      </TableCell>

                      <TableCell>
                        {submission.fileUrl ? (
                          <a
                            href={submission.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary underline"
                          >
                            {submission.fileName || "View file"}
                          </a>
                        ) : (
                          "No file"
                        )}
                      </TableCell>

                      <TableCell>
                        {submission.feedback || "No feedback"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
