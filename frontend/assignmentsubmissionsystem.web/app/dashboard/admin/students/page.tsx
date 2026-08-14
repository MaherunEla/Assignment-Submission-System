"use client";

import { useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createStudent,
  deleteStudent,
  getAcademicClasses,
  getStudents,
  updateStudent,
} from "@/lib/api/students";

import {
  CreateStudentForm,
  UpdateStudentForm,
} from "@/lib/validations/student";

import { Student } from "@/types/student";

import StudentDialog from "@/component/students/StudentDialog";
import DeleteStudentDialog from "@/component/students/DeleteStudentDialog";

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

export default function StudentsPage() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);

  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);

  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);

  // ---------------------------------------------
  // GET STUDENTS
  // ---------------------------------------------

  const {
    data: students = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["students"],
    queryFn: getStudents,
  });

  // ---------------------------------------------
  // GET CLASSES
  // ---------------------------------------------

  const { data: classes = [] } = useQuery({
    queryKey: ["academic-classes"],
    queryFn: getAcademicClasses,
  });

  // ---------------------------------------------
  // CREATE
  // ---------------------------------------------

  const createMutation = useMutation({
    mutationFn: createStudent,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["students"],
      });

      setDialogOpen(false);
    },
  });

  // ---------------------------------------------
  // UPDATE
  // ---------------------------------------------

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateStudentForm }) =>
      updateStudent(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["students"],
      });

      setDialogOpen(false);
      setEditingStudent(null);
    },
  });

  // ---------------------------------------------
  // DELETE
  // ---------------------------------------------

  const deleteMutation = useMutation({
    mutationFn: deleteStudent,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["students"],
      });

      setDeleteOpen(false);
      setDeletingStudent(null);
    },
  });

  // ---------------------------------------------
  // FORM SUBMIT
  // ---------------------------------------------

  const handleSubmit = (data: CreateStudentForm | UpdateStudentForm) => {
    if (editingStudent) {
      updateMutation.mutate({
        id: editingStudent.id,
        data: data as UpdateStudentForm,
      });
    } else {
      createMutation.mutate(data as CreateStudentForm);
    }
  };

  // ---------------------------------------------
  // SEARCH
  // ---------------------------------------------

  const filteredStudents = students.filter(
    (student) =>
      student.fullName.toLowerCase().includes(search.toLowerCase()) ||
      student.email.toLowerCase().includes(search.toLowerCase()),
  );

  // ---------------------------------------------
  // LOADING
  // ---------------------------------------------

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        Loading students...
      </div>
    );
  }

  // ---------------------------------------------
  // ERROR
  // ---------------------------------------------

  if (isError) {
    return <div className="text-destructive">Failed to load students.</div>;
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Students</h1>

          <p className="text-muted-foreground">
            Manage students and their academic classes.
          </p>
        </div>

        <Button
          onClick={() => {
            setEditingStudent(null);
            setDialogOpen(true);
          }}
        >
          + Add Student
        </Button>
      </div>

      {/* CARD */}

      <Card>
        <CardHeader>
          <CardTitle>Student List</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* SEARCH */}

          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />

          {/* RESPONSIVE TABLE */}

          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>

                  <TableHead>Email</TableHead>

                  <TableHead>Class</TableHead>

                  <TableHead>Role</TableHead>

                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10">
                      No students found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">
                        {student.fullName}
                      </TableCell>

                      <TableCell>{student.email}</TableCell>

                      <TableCell>
                        {student.academicClassName || "Not assigned"}
                      </TableCell>

                      <TableCell>
                        <Badge variant="secondary">{student.roleName}</Badge>
                      </TableCell>

                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingStudent(student);

                              setDialogOpen(true);
                            }}
                          >
                            Edit
                          </Button>

                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              setDeletingStudent(student);

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

      <StudentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        student={editingStudent}
        classes={classes}
        onSubmit={handleSubmit}
        loading={createMutation.isPending || updateMutation.isPending}
      />

      {/* DELETE */}

      <DeleteStudentDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        studentName={deletingStudent?.fullName}
        onConfirm={() => {
          if (deletingStudent) {
            deleteMutation.mutate(deletingStudent.id);
          }
        }}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
