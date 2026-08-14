"use client";

import { useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createTeacher,
  deleteTeacher,
  getTeachers,
  updateTeacher,
} from "@/lib/api/teachers";

import { Teacher } from "@/types/teacher";

import TeacherDialog from "@/component/teachers/TeacherDialog";
import DeleteTeacherDialog from "@/component/teachers/DeleteTeacherDialog";

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
import {
  CreateTeacherForm,
  UpdateTeacherForm,
} from "@/lib/validations/teacher";

export default function TeachersPage() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);

  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);

  const [deletingTeacher, setDeletingTeacher] = useState<Teacher | null>(null);

  // ---------------------------------------------
  // GET TEACHERS
  // ---------------------------------------------

  const {
    data: teachers = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["teachers"],
    queryFn: getTeachers,
  });

  // ---------------------------------------------
  // CREATE
  // ---------------------------------------------

  const createMutation = useMutation({
    mutationFn: createTeacher,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teachers"],
      });

      setDialogOpen(false);
    },
  });

  // ---------------------------------------------
  // UPDATE
  // ---------------------------------------------

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTeacherForm }) =>
      updateTeacher(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teachers"],
      });

      setDialogOpen(false);
      setEditingTeacher(null);
    },
  });

  // ---------------------------------------------
  // DELETE
  // ---------------------------------------------

  const deleteMutation = useMutation({
    mutationFn: deleteTeacher,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teachers"],
      });

      setDeleteOpen(false);
      setDeletingTeacher(null);
    },
  });

  // ---------------------------------------------
  // FORM SUBMIT
  // ---------------------------------------------

  const handleSubmit = (data: CreateTeacherForm | UpdateTeacherForm) => {
    if (editingTeacher) {
      updateMutation.mutate({
        id: editingTeacher.id,
        data: data as UpdateTeacherForm,
      });
    } else {
      createMutation.mutate(data as CreateTeacherForm);
    }
  };

  // ---------------------------------------------
  // SEARCH
  // ---------------------------------------------

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.fullName.toLowerCase().includes(search.toLowerCase()) ||
      teacher.email.toLowerCase().includes(search.toLowerCase()),
  );

  // ---------------------------------------------
  // LOADING
  // ---------------------------------------------

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        Loading teachers...
      </div>
    );
  }

  // ---------------------------------------------
  // ERROR
  // ---------------------------------------------

  if (isError) {
    return <div className="text-destructive">Failed to load teachers.</div>;
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Teachers</h1>

          <p className="text-muted-foreground">
            Manage teachers and their accounts.
          </p>
        </div>

        <Button
          onClick={() => {
            setEditingTeacher(null);
            setDialogOpen(true);
          }}
        >
          + Add Teacher
        </Button>
      </div>

      {/* CARD */}

      <Card>
        <CardHeader>
          <CardTitle>Teacher List</CardTitle>
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

                  <TableHead>Role</TableHead>

                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredTeachers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-10 text-center">
                      No teachers found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTeachers.map((teacher) => (
                    <TableRow key={teacher.id}>
                      <TableCell className="font-medium">
                        {teacher.fullName}
                      </TableCell>

                      <TableCell>{teacher.email}</TableCell>

                      <TableCell>
                        <Badge variant="secondary">{teacher.roleName}</Badge>
                      </TableCell>

                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingTeacher(teacher);

                              setDialogOpen(true);
                            }}
                          >
                            Edit
                          </Button>

                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              setDeletingTeacher(teacher);

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

      <TeacherDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        teacher={editingTeacher}
        onSubmit={handleSubmit}
        loading={createMutation.isPending || updateMutation.isPending}
      />

      {/* DELETE */}

      <DeleteTeacherDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        teacher={deletingTeacher}
        onConfirm={() => {
          if (deletingTeacher) {
            deleteMutation.mutate(deletingTeacher.id);
          }
        }}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
