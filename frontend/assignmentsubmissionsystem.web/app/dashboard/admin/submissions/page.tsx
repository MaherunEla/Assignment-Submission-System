"use client";

import { useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { getMySubmissions } from "@/lib/api/submissions";

import { SubmissionStatus } from "@/types/submission";

import { Input } from "@/components/ui/input";

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

export default function SubmissionsPage() {
  const [search, setSearch] = useState("");

  const {
    data: submissions = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["submissions"],
    queryFn: getMySubmissions,
  });

  const filteredSubmissions = submissions.filter(
    (submission) =>
      submission.studentName.toLowerCase().includes(search.toLowerCase()) ||
      submission.assignmentTitle.toLowerCase().includes(search.toLowerCase()),
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        Loading submissions...
      </div>
    );
  }

  if (isError) {
    return <div className="text-destructive">Failed to load submissions.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Submissions</h1>

        <p className="text-muted-foreground">
          Monitor student assignment submissions.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Submission List</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <Input
            placeholder="Search by student or assignment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />

          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Assignment</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Marks</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>File</TableHead>
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

                      <TableCell>{submission.assignmentTitle}</TableCell>

                      <TableCell>
                        {new Date(submission.submittedAt).toLocaleString()}
                      </TableCell>

                      <TableCell>{submission.marks ?? "Not graded"}</TableCell>

                      <TableCell>
                        <Badge>
                          {submission.status === SubmissionStatus.Reviewed
                            ? "Reviewed"
                            : "Submitted"}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        {submission.fileName ? submission.fileName : "No file"}
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
