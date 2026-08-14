"use client";

import { useState } from "react";
import { Menu } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import Sidebar from "./Sidebar";

export default function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="inline-flex h-9 w-9 items-center justify-center rounded-md text-sm hover:bg-accent hover:text-accent-foreground md:hidden">
        <Menu className="h-5 w-5" />

        <span className="sr-only">Open navigation</span>
      </SheetTrigger>

      <SheetContent side="left" className="w-72 p-0">
        <Sidebar onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
