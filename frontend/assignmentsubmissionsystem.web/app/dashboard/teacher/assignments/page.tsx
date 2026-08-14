"use client";

import { useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createAssignment,
  deleteAssignment,
  getMyAssignments,
  updateAssignment,
} from "@/lib/api/assignments";

import { getAcademicClasses } from "@/lib/api/classes";
import { getSubjects } from "@/lib/api/subject";

import {
  CreateAssignmentForm,
  UpdateAssignmentForm,
} from "@/lib/validations/assignment";

import { Assignment } from "@/types/assignment";

import AssignmentDialog from "@/component/assignments/AssignmentDialog";
import DeleteAssignmentDialog from "@/component/assignments/DeleteAssignmentDialog";

import { Button } from "@/components/ui/button";
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

export default function TeacherAssignmentsPage() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);

  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(
    null,
  );

  const [deleteOpen, setDeleteOpen] = useState(false);

  const [deletingAssignment, setDeletingAssignment] =
    useState<Assignment | null>(null);

  const {
    data: assignments = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["teacher-assignments"],
    queryFn: getMyAssignments,
  });

  const { data: classes = [] } = useQuery({
    queryKey: ["academic-classes"],
    queryFn: getAcademicClasses,
  });

  // ---------------------------------------------
  // GET SUBJECTS
  // ---------------------------------------------

  const { data: subjects = [] } = useQuery({
    queryKey: ["subjects"],
    queryFn: getSubjects,
  });

  // ---------------------------------------------
  // CREATE
  // ---------------------------------------------

  const createMutation = useMutation({
    mutationFn: createAssignment,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teacher-assignments"],
      });

      setDialogOpen(false);
    },
  });

  // ---------------------------------------------
  // UPDATE
  // ---------------------------------------------

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAssignmentForm }) =>
      updateAssignment(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teacher-assignments"],
      });

      setDialogOpen(false);
      setEditingAssignment(null);
    },
  });

  // ---------------------------------------------
  // DELETE
  // ---------------------------------------------

  const deleteMutation = useMutation({
    mutationFn: deleteAssignment,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teacher-assignments"],
      });

      setDeleteOpen(false);
      setDeletingAssignment(null);
    },
  });

  const handleSubmit = (data: CreateAssignmentForm | UpdateAssignmentForm) => {
    if (editingAssignment) {
      updateMutation.mutate({
        id: editingAssignment.id,
        data: data as UpdateAssignmentForm,
      });
    } else {
      createMutation.mutate(data as CreateAssignmentForm);
    }
  };

  const filteredAssignments = assignments.filter(
    (assignment) =>
      assignment.title.toLowerCase().includes(search.toLowerCase()) ||
      assignment.subjectName.toLowerCase().includes(search.toLowerCase()) ||
      assignment.academicClassName.toLowerCase().includes(search.toLowerCase()),
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        Loading assignments...
      </div>
    );
  }

  if (isError) {
    return <div className="text-destructive">Failed to load assignments.</div>;
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Assignments</h1>

          <p className="text-muted-foreground">
            Create and manage assignments for your students.
          </p>
        </div>

        <Button
          onClick={() => {
            setEditingAssignment(null);
            setDialogOpen(true);
          }}
        >
          + Create Assignment
        </Button>
      </div>

      {/* CARD */}

      <Card>
        <CardHeader>
          <CardTitle>Assignment List</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* SEARCH */}

          <Input
            placeholder="Search by title, subject or class..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />

          {/* TABLE */}

          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>

                  <TableHead>Subject</TableHead>

                  <TableHead>Class</TableHead>

                  <TableHead>Deadline</TableHead>

                  <TableHead>Marks</TableHead>

                  <TableHead>Status</TableHead>

                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredAssignments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-10 text-center">
                      No assignments found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAssignments.map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell className="font-medium">
                        {assignment.title}
                      </TableCell>

                      <TableCell>{assignment.subjectName}</TableCell>

                      <TableCell>{assignment.academicClassName}</TableCell>

                      <TableCell>
                        {new Date(assignment.deadline).toLocaleString()}
                      </TableCell>

                      <TableCell>{assignment.maximumMarks}</TableCell>

                      <TableCell>
                        <Badge
                          variant={
                            assignment.isPublished ? "default" : "secondary"
                          }
                        >
                          {assignment.isPublished ? "Published" : "Draft"}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingAssignment(assignment);

                              setDialogOpen(true);
                            }}
                          >
                            Edit
                          </Button>

                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              setDeletingAssignment(assignment);

                              setDeleteOpen(true);
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* CREATE / EDIT */}

      <AssignmentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        assignment={editingAssignment}
        classes={classes}
        subjects={subjects}
        onSubmit={handleSubmit}
        loading={createMutation.isPending || updateMutation.isPending}
      />

      {/* DELETE */}

      <DeleteAssignmentDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        assignmentTitle={deletingAssignment?.title}
        onConfirm={() => {
          if (deletingAssignment) {
            deleteMutation.mutate(deletingAssignment.id);
          }
        }}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
