"use client";

import { useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createTeacherAssignment,
  deleteTeacherAssignment,
  getTeacherAssignments,
  updateTeacherAssignment,
} from "@/lib/api/teacherAssignments";

import { getTeachers } from "@/lib/api/teachers";
import { getAcademicClasses } from "@/lib/api/classes";
import { getSubjects } from "@/lib/api/subject";

import {
  CreateTeacherAssignmentForm,
  UpdateTeacherAssignmentForm,
} from "@/lib/validations/teacherAssignment";

import { TeacherAssignment } from "@/types/teacher-assignment";

import TeacherAssignmentDialog from "@/component/teacherAssignments/TeacherAssignmentDialog";

import DeleteTeacherAssignmentDialog from "@/component/teacherAssignments/DeleteTeacherAssignmentDialog";

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

export default function TeacherAssignmentsPage() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);

  const [editingTeacherAssignment, setEditingTeacherAssignment] =
    useState<TeacherAssignment | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);

  const [deletingTeacherAssignment, setDeletingTeacherAssignment] =
    useState<TeacherAssignment | null>(null);

  // ---------------------------------------------
  // GET TEACHER ASSIGNMENTS
  // ---------------------------------------------

  const {
    data: teacherAssignments = [],
    isLoading,
    isError,
  } = useQuery<TeacherAssignment[]>({
    queryKey: ["teacher-assignments"],
    queryFn: getTeacherAssignments,
  });

  // ---------------------------------------------
  // GET TEACHERS
  // ---------------------------------------------

  const { data: teachers = [] } = useQuery({
    queryKey: ["teachers"],
    queryFn: getTeachers,
  });

  // ---------------------------------------------
  // GET CLASSES
  // ---------------------------------------------

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
    mutationFn: createTeacherAssignment,

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
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UpdateTeacherAssignmentForm;
    }) => updateTeacherAssignment(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teacher-assignments"],
      });

      setDialogOpen(false);
      setEditingTeacherAssignment(null);
    },
  });

  // ---------------------------------------------
  // DELETE
  // ---------------------------------------------

  const deleteMutation = useMutation({
    mutationFn: deleteTeacherAssignment,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teacher-assignments"],
      });

      setDeleteOpen(false);
      setDeletingTeacherAssignment(null);
    },
  });

  // ---------------------------------------------
  // FORM SUBMIT
  // ---------------------------------------------

  const handleSubmit = (
    data: CreateTeacherAssignmentForm | UpdateTeacherAssignmentForm,
  ) => {
    if (editingTeacherAssignment) {
      updateMutation.mutate({
        id: editingTeacherAssignment.id,
        data: data as UpdateTeacherAssignmentForm,
      });
    } else {
      createMutation.mutate(data as CreateTeacherAssignmentForm);
    }
  };

  // ---------------------------------------------
  // SEARCH
  // ---------------------------------------------

  const filteredAssignments = teacherAssignments.filter((assignment) => {
    const searchText = search.toLowerCase();

    return (
      assignment.teacherName.toLowerCase().includes(searchText) ||
      assignment.academicClassName.toLowerCase().includes(searchText) ||
      assignment.subjectName.toLowerCase().includes(searchText)
    );
  });

  // ---------------------------------------------
  // LOADING
  // ---------------------------------------------

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        Loading teacher assignments...
      </div>
    );
  }

  // ---------------------------------------------
  // ERROR
  // ---------------------------------------------

  if (isError) {
    return (
      <div className="text-destructive">
        Failed to load teacher assignments.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Teacher Assignments</h1>

          <p className="text-muted-foreground">
            Assign teachers to academic classes and subjects.
          </p>
        </div>

        <Button
          onClick={() => {
            setEditingTeacherAssignment(null);

            setDialogOpen(true);
          }}
        >
          + Assign Teacher
        </Button>
      </div>

      {/* CARD */}

      <Card>
        <CardHeader>
          <CardTitle>Teacher Assignment List</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* SEARCH */}

          <Input
            placeholder="Search by teacher, class or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />

          {/* TABLE */}

          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Teacher</TableHead>

                  <TableHead>Class</TableHead>

                  <TableHead>Subject</TableHead>

                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredAssignments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-10 text-center">
                      No teacher assignments found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAssignments.map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell className="font-medium">
                        {assignment.teacherName}
                      </TableCell>

                      <TableCell>{assignment.academicClassName}</TableCell>

                      <TableCell>{assignment.subjectName}</TableCell>

                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingTeacherAssignment(assignment);

                              setDialogOpen(true);
                            }}
                          >
                            Edit
                          </Button>

                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              setDeletingTeacherAssignment(assignment);

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

      <TeacherAssignmentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        teacherAssignment={editingTeacherAssignment}
        teachers={teachers}
        classes={classes}
        subjects={subjects}
        onSubmit={handleSubmit}
        loading={createMutation.isPending || updateMutation.isPending}
      />

      {/* DELETE */}

      <DeleteTeacherAssignmentDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        assignmentName={
          deletingTeacherAssignment
            ? `${deletingTeacherAssignment.teacherName} - ${deletingTeacherAssignment.subjectName} (${deletingTeacherAssignment.academicClassName})`
            : undefined
        }
        onConfirm={() => {
          if (deletingTeacherAssignment) {
            deleteMutation.mutate(deletingTeacherAssignment.id);
          }
        }}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
