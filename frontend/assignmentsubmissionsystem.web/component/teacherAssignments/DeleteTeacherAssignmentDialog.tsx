"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteTeacherAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  assignmentName?: string;

  onConfirm: () => void;

  loading?: boolean;
}

export default function DeleteTeacherAssignmentDialog({
  open,
  onOpenChange,
  assignmentName,
  onConfirm,
  loading = false,
}: DeleteTeacherAssignmentDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Teacher Assignment?</AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to remove <strong>{assignmentName}</strong>?
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>

          <AlertDialogAction
            onClick={onConfirm}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
