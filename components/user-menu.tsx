"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { LogOut, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOutAction } from "@/actions/auth";

export function UserMenu({
  children,
  side = "top",
  align = "start",
}: {
  children: ReactNode;
  side?: "top" | "bottom";
  align?: "start" | "end";
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<button type="button" />}>{children}</DropdownMenuTrigger>
      <DropdownMenuContent side={side} align={align} className="w-52">
        <DropdownMenuItem render={<Link href="/settings" />} className="gap-2 py-2">
          <Settings className="size-4" strokeWidth={2} />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          onClick={() => signOutAction()}
          className="gap-2 py-2"
        >
          <LogOut className="size-4" strokeWidth={2} />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
