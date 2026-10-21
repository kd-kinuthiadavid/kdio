import { notFound, redirect } from "next/navigation";

import { DocumentForm } from "@/components/admin/DocumentForm";
import { listCustomers } from "@/lib/documents/customers";
import { formValuesFromDocument } from "@/lib/documents/form-model";
import { getDocumentType } from "@/lib/documents/registry";
import { getDocument } from "@/lib/documents/service";

export default async function EditDocumentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const found = await getDocument(id).catch(() => null);
  if (!found) notFound();
  const { document } = found;
  if (document.status !== "draft") redirect(`/admin/documents/${id}`);

  const def = getDocumentType(document.type);
  const customers = await listCustomers();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Edit {def.label.toLowerCase()} draft</h1>
      <DocumentForm
        type={document.type}
        typeLabel={def.label}
        customers={customers}
        initial={formValuesFromDocument(document)}
      />
    </div>
  );
}
