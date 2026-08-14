"use client";

import { Pencil, Trash2 } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Teacher } from "@/types/teacher";

interface TeacherTableProps {
  teachers: Teacher[];
  onEdit: (teacher: Teacher) => void;
  onDelete: (teacher: Teacher) => void;
}

export default function TeacherTable({
  teachers,
  onEdit,
  onDelete,
}: TeacherTableProps) {
  if (teachers.length === 0) {
    return (
      <div className="rounded-lg border p-8 text-center text-muted-foreground">
        No teachers found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {teachers.map((teacher) => (
            <TableRow key={teacher.id}>
              <TableCell>{teacher.id}</TableCell>

              <TableCell className="font-medium">{teacher.fullName}</TableCell>

              <TableCell>{teacher.email}</TableCell>

              <TableCell>
                <Badge variant="secondary">{teacher.roleName}</Badge>
              </TableCell>

              <TableCell>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEdit(teacher)}
                  >
                    <Pencil className="h-4 w-4" />

                    <span className="sr-only">Edit teacher</span>
                  </Button>

                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => onDelete(teacher)}
                  >
                    <Trash2 className="h-4 w-4" />

                    <span className="sr-only">Delete teacher</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
