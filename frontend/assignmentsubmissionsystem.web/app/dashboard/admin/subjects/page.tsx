"use client";

import { useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createSubject,
  deleteSubject,
  getSubjects,
  updateSubject,
} from "@/lib/api/subject";

import { getAcademicClasses } from "@/lib/api/classes";

import {
  CreateSubjectForm,
  UpdateSubjectForm,
} from "@/lib/validations/subject";

import { Subject } from "@/types/subject";

import SubjectDialog from "@/component/subjects/SubjectDialog";
import DeleteSubjectDialog from "@/component/subjects/DeleteSubjectDialog";

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

export default function SubjectsPage() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);

  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);

  const [deletingSubject, setDeletingSubject] = useState<Subject | null>(null);

  // ---------------------------------------------
  // GET SUBJECTS
  // ---------------------------------------------

  const {
    data: subjects = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["subjects"],
    queryFn: getSubjects,
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
    mutationFn: createSubject,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["subjects"],
      });

      setDialogOpen(false);
    },
  });

  // ---------------------------------------------
  // UPDATE
  // ---------------------------------------------

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSubjectForm }) =>
      updateSubject(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["subjects"],
      });

      setDialogOpen(false);
      setEditingSubject(null);
    },
  });

  // ---------------------------------------------
  // DELETE
  // ---------------------------------------------

  const deleteMutation = useMutation({
    mutationFn: deleteSubject,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["subjects"],
      });

      setDeleteOpen(false);
      setDeletingSubject(null);
    },
  });

  // ---------------------------------------------
  // FORM SUBMIT
  // ---------------------------------------------

  const handleSubmit = (data: CreateSubjectForm | UpdateSubjectForm) => {
    if (editingSubject) {
      updateMutation.mutate({
        id: editingSubject.id,
        data: data as UpdateSubjectForm,
      });
    } else {
      createMutation.mutate(data as CreateSubjectForm);
    }
  };

  // ---------------------------------------------
  // SEARCH
  // ---------------------------------------------

  const filteredSubjects = subjects.filter(
    (subject) =>
      subject.name.toLowerCase().includes(search.toLowerCase()) ||
      subject.academicClassName.toLowerCase().includes(search.toLowerCase()),
  );

  // ---------------------------------------------
  // LOADING
  // ---------------------------------------------

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        Loading subjects...
      </div>
    );
  }

  // ---------------------------------------------
  // ERROR
  // ---------------------------------------------

  if (isError) {
    return <div className="text-destructive">Failed to load subjects.</div>;
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Subjects</h1>

          <p className="text-muted-foreground">
            Manage subjects and their academic classes.
          </p>
        </div>

        <Button
          onClick={() => {
            setEditingSubject(null);
            setDialogOpen(true);
          }}
        >
          + Add Subject
        </Button>
      </div>

      {/* CARD */}

      <Card>
        <CardHeader>
          <CardTitle>Subject List</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* SEARCH */}

          <Input
            placeholder="Search by subject or class..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />

          {/* RESPONSIVE TABLE */}

          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>

                  <TableHead>Academic Class</TableHead>

                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredSubjects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="py-10 text-center">
                      No subjects found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSubjects.map((subject) => (
                    <TableRow key={subject.id}>
                      <TableCell className="font-medium">
                        {subject.name}
                      </TableCell>

                      <TableCell>
                        {subject.academicClassName || "Not assigned"}
                      </TableCell>

                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingSubject(subject);

                              setDialogOpen(true);
                            }}
                          >
                            Edit
                          </Button>

                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              setDeletingSubject(subject);

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

      <SubjectDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        subject={editingSubject}
        classes={classes}
        onSubmit={handleSubmit}
        loading={createMutation.isPending || updateMutation.isPending}
      />

      {/* DELETE */}

      <DeleteSubjectDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        subjectName={deletingSubject?.name}
        onConfirm={() => {
          if (deletingSubject) {
            deleteMutation.mutate(deletingSubject.id);
          }
        }}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
