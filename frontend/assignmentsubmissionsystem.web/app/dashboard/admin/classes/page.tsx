"use client";

import { useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createAcademicClass,
  deleteAcademicClass,
  getAcademicClasses,
  updateAcademicClass,
} from "@/lib/api/classes";

import {
  CreateAcademicClassForm,
  UpdateAcademicClassForm,
} from "@/lib/validations/class";

import { AcademicClass } from "@/types/class";

import ClassDialog from "@/component/classes/ClassDialog";
import DeleteClassDialog from "@/component/classes/DeleteClassDialog";

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

export default function ClassesPage() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);

  const [editingClass, setEditingClass] = useState<AcademicClass | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);

  const [deletingClass, setDeletingClass] = useState<AcademicClass | null>(
    null,
  );

  // ---------------------------------------------
  // GET CLASSES
  // ---------------------------------------------

  const {
    data: classes = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["academic-classes"],
    queryFn: getAcademicClasses,
  });

  // ---------------------------------------------
  // CREATE
  // ---------------------------------------------

  const createMutation = useMutation({
    mutationFn: createAcademicClass,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["academic-classes"],
      });

      setDialogOpen(false);
    },
  });

  // ---------------------------------------------
  // UPDATE
  // ---------------------------------------------

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAcademicClassForm }) =>
      updateAcademicClass(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["academic-classes"],
      });

      setDialogOpen(false);
      setEditingClass(null);
    },
  });

  // ---------------------------------------------
  // DELETE
  // ---------------------------------------------

  const deleteMutation = useMutation({
    mutationFn: deleteAcademicClass,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["academic-classes"],
      });

      setDeleteOpen(false);
      setDeletingClass(null);
    },
  });

  // ---------------------------------------------
  // FORM SUBMIT
  // ---------------------------------------------

  const handleSubmit = (
    data: CreateAcademicClassForm | UpdateAcademicClassForm,
  ) => {
    if (editingClass) {
      updateMutation.mutate({
        id: editingClass.id,
        data: data as UpdateAcademicClassForm,
      });
    } else {
      createMutation.mutate(data as CreateAcademicClassForm);
    }
  };

  // ---------------------------------------------
  // SEARCH
  // ---------------------------------------------

  const filteredClasses = classes.filter((academicClass) =>
    academicClass.name.toLowerCase().includes(search.toLowerCase()),
  );

  // ---------------------------------------------
  // LOADING
  // ---------------------------------------------

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        Loading classes...
      </div>
    );
  }

  // ---------------------------------------------
  // ERROR
  // ---------------------------------------------

  if (isError) {
    return <div className="text-destructive">Failed to load classes.</div>;
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Academic Classes</h1>

          <p className="text-muted-foreground">Manage academic classes.</p>
        </div>

        <Button
          onClick={() => {
            setEditingClass(null);
            setDialogOpen(true);
          }}
        >
          + Add Class
        </Button>
      </div>

      {/* CARD */}

      <Card>
        <CardHeader>
          <CardTitle>Class List</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* SEARCH */}

          <Input
            placeholder="Search class..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />

          {/* RESPONSIVE TABLE */}

          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>

                  <TableHead>Class Name</TableHead>

                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredClasses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="py-10 text-center">
                      No classes found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredClasses.map((academicClass) => (
                    <TableRow key={academicClass.id}>
                      <TableCell>{academicClass.id}</TableCell>

                      <TableCell className="font-medium">
                        {academicClass.name}
                      </TableCell>

                      <TableCell>
                        <div className="flex justify-end gap-2">
                          {/* EDIT */}

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingClass(academicClass);

                              setDialogOpen(true);
                            }}
                          >
                            Edit
                          </Button>

                          {/* DELETE */}

                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              setDeletingClass(academicClass);

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

      <ClassDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        academicClass={editingClass}
        onSubmit={handleSubmit}
        loading={createMutation.isPending || updateMutation.isPending}
      />

      {/* DELETE */}

      <DeleteClassDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        academicClass={deletingClass}
        onConfirm={() => {
          if (deletingClass) {
            deleteMutation.mutate(deletingClass.id);
          }
        }}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
