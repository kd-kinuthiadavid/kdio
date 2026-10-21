"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { deleteDraftAction, issueDocumentAction } from "@/app/admin/(protected)/documents/actions";
import { ConfirmActionButton } from "@/components/admin/ConfirmActionButton";
import { SendDocumentForm } from "@/components/admin/SendDocumentForm";
import { VoidDocumentForm } from "@/components/admin/VoidDocumentForm";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { DocumentStatus } from "@/db/schema";

type Panel = "send" | "void" | null;

export function DocumentHeader({
  id,
  label,
  status,
  isInvoice,
  defaultTo,
  defaultCc,
  children,
}: {
  id: string;
  label: string;
  status: DocumentStatus;
  isInvoice: boolean;
  defaultTo: string;
  defaultCc: string;
  children: React.ReactNode;
}) {
  const [panel, setPanel] = useState<Panel>(null);
  const issued = status === "issued";
  const active = issued ? panel : null;

  return (
    <header className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">{children}</div>
        <div className="flex flex-wrap items-start gap-2 sm:justify-end">
          {status === "draft" ? (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/admin/documents/${id}/edit`}>Edit</Link>
              </Button>
              <ConfirmActionButton
                action={issueDocumentAction}
                id={id}
                label="Issue"
                pendingLabel="Issuing…"
                confirm={`Issue this ${label.toLowerCase()}? It gets a number and can no longer be edited.`}
              />
              <ConfirmActionButton
                action={deleteDraftAction}
                id={id}
                label="Delete draft"
                variant="ghost"
                confirm="Delete this draft?"
              />
            </>
          ) : null}
          {issued ? (
            <>
              <Button size="sm" onClick={() => setPanel(active === "send" ? null : "send")}>
                Send by email
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    More
                    <ChevronDown aria-hidden />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="admin-theme min-w-44">
                  {isInvoice ? (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/documents/new?type=credit_note&from=${id}`}>
                          New credit note
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/documents/new?type=debit_note&from=${id}`}>
                          New debit note
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  ) : null}
                  <DropdownMenuItem
                    className="text-danger focus:text-danger"
                    onSelect={() => setPanel("void")}
                  >
                    Void {label.toLowerCase()}…
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : null}
        </div>
      </div>
      {active ? (
        <div className="rounded-lg border border-border bg-card/60 p-4">
          {active === "send" ? (
            <SendDocumentForm
              id={id}
              defaultTo={defaultTo}
              defaultCc={defaultCc}
              onClose={() => setPanel(null)}
            />
          ) : (
            <VoidDocumentForm id={id} label={label} onCancel={() => setPanel(null)} />
          )}
        </div>
      ) : null}
    </header>
  );
}
