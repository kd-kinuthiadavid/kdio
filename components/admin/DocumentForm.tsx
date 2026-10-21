"use client";

import { Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useActionState, useState } from "react";

import { saveDraftAction } from "@/app/admin/(protected)/documents/actions";
import { FormError, FormField, type FormState } from "@/components/admin/FormField";
import { Notice } from "@/components/admin/Notice";
import { useFormSubmit } from "@/components/admin/use-form-submit";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import type { CustomerRow, DocumentType } from "@/db/schema";
import { addDaysIso } from "@/lib/documents/dates";
import {
  emptyFormLine,
  isComputable,
  toDiscount,
  toDocumentData,
  toLineItem,
  type DocumentFormValues,
  type FormDiscount,
  type FormLine,
} from "@/lib/documents/form-model";
import { computeLineTotals, UNITS } from "@/lib/documents/line-items";
import {
  CURRENCIES,
  formatMoney,
  PAYMENT_METHOD_LABELS,
  type PaymentMethod,
} from "@/lib/documents/money";
import { reasonOptions } from "@/lib/documents/reasons";
import { SETTLEMENT_METHODS, type SettlementMethod } from "@/lib/documents/types/credit-note";

export type DocumentFormCustomer = Pick<
  CustomerRow,
  "id" | "name" | "company" | "defaultCurrency" | "paymentTermsDays"
>;

export function DocumentForm({
  type,
  typeLabel,
  customers,
  initial,
  parent,
  cancelHref = "/admin/documents",
}: {
  type: DocumentType;
  typeLabel: string;
  customers: DocumentFormCustomer[];
  initial: DocumentFormValues;
  /** The issued invoice a credit or debit note adjusts */
  parent?: { number: string; balance: string };
  cancelHref?: string;
}) {
  const reasons = reasonOptions(type);
  const hasDueDate = type !== "credit_note";
  const locked = Boolean(parent);
  const [state, action, pending] = useActionState<FormState, FormData>(saveDraftAction, {});
  const onSubmit = useFormSubmit(action);
  const [values, setValues] = useState<DocumentFormValues>(initial);
  const e = state.fieldErrors ?? {};

  function set<K extends keyof DocumentFormValues>(key: K, value: DocumentFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function setLine(index: number, patch: Partial<FormLine>) {
    setValues((v) => ({
      ...v,
      lines: v.lines.map((l, i) => (i === index ? { ...l, ...patch } : l)),
    }));
  }

  function onCustomerChange(customerId: string) {
    const c = customers.find((x) => x.id === customerId);
    setValues((v) => ({
      ...v,
      customerId,
      currency: c && !v.id ? c.defaultCurrency : v.currency,
      dueDate: c && !v.id ? addDaysIso(v.issueDate, c.paymentTermsDays) : v.dueDate,
    }));
  }

  const lineItems = values.lines.map(toLineItem);
  const documentDiscount = toDiscount(values.documentDiscount);
  const computable = lineItems.map(isComputable);
  const docDiscountOk = !documentDiscount || Number.isFinite(documentDiscount.value);
  const totals = computeLineTotals(
    lineItems.filter((_, i) => computable[i]),
    docDiscountOk ? documentDiscount : null
  );
  let k = 0;
  const lineTotalsByIndex = computable.map((ok) => (ok ? totals.lines[k++] : undefined));

  const payload = JSON.stringify({
    id: values.id,
    type,
    customerId: values.customerId,
    currency: values.currency,
    relatedDocumentId: values.relatedDocumentId ?? null,
    data: toDocumentData(type, values),
  });

  const money = (minor: number) => formatMoney(minor, values.currency);

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <input type="hidden" name="payload" value={payload} />
      <FormError state={state} />

      {parent ? (
        <p className="text-sm text-muted-foreground">
          Adjusts invoice <span className="font-medium text-foreground">{parent.number}</span>,
          current balance <span className="font-medium text-foreground">{parent.balance}</span>.
          Customer and currency follow the invoice.
        </p>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{typeLabel} details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <FormField label="Customer" htmlFor="customerId" error={e.customerId} className="sm:col-span-2">
            <NativeSelect
              id="customerId"
              value={values.customerId}
              disabled={locked}
              onChange={(ev) => onCustomerChange(ev.target.value)}
            >
              <option value="">Choose a customer…</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.company ? `${c.company} (${c.name})` : c.name}
                </option>
              ))}
            </NativeSelect>
          </FormField>
          <FormField label="Currency" htmlFor="currency" error={e.currency}>
            <NativeSelect
              id="currency"
              value={values.currency}
              disabled={locked}
              onChange={(ev) => set("currency", ev.target.value)}
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </NativeSelect>
          </FormField>
          <FormField label="Reference / PO" htmlFor="reference" error={e.reference}>
            <Input
              id="reference"
              value={values.reference}
              onChange={(ev) => set("reference", ev.target.value)}
            />
          </FormField>
          <FormField label="Issue date" htmlFor="issueDate" error={e.issueDate}>
            <Input
              id="issueDate"
              type="date"
              value={values.issueDate}
              onChange={(ev) => set("issueDate", ev.target.value)}
            />
          </FormField>
          {hasDueDate ? (
            <FormField label="Due date" htmlFor="dueDate" error={e.dueDate}>
              <Input
                id="dueDate"
                type="date"
                value={values.dueDate}
                onChange={(ev) => set("dueDate", ev.target.value)}
              />
            </FormField>
          ) : null}
          {type === "invoice" ? (
            <>
              <FormField label="Service period from" htmlFor="spFrom" error={e.servicePeriodFrom}>
                <Input
                  id="spFrom"
                  type="date"
                  value={values.servicePeriodFrom}
                  onChange={(ev) => set("servicePeriodFrom", ev.target.value)}
                />
              </FormField>
              <FormField label="Service period to" htmlFor="spTo" error={e.servicePeriodTo}>
                <Input
                  id="spTo"
                  type="date"
                  value={values.servicePeriodTo}
                  onChange={(ev) => set("servicePeriodTo", ev.target.value)}
                />
              </FormField>
            </>
          ) : null}
        </CardContent>
      </Card>

      {reasons ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Reason</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <FormField label="Reason" htmlFor="reason" error={e.reason} className="sm:col-span-2">
              <NativeSelect
                id="reason"
                value={values.reason}
                onChange={(ev) => set("reason", ev.target.value)}
              >
                <option value="">Choose a reason…</option>
                {Object.entries(reasons).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </NativeSelect>
            </FormField>
            {type === "credit_note" ? (
              <FormField
                label="Settlement"
                htmlFor="settlementMethod"
                error={e["settlement.method"]}
                className="sm:col-span-2"
              >
                <NativeSelect
                  id="settlementMethod"
                  value={values.settlementMethod}
                  onChange={(ev) =>
                    set("settlementMethod", ev.target.value as SettlementMethod | "")
                  }
                >
                  <option value="">Choose…</option>
                  {Object.entries(SETTLEMENT_METHODS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </NativeSelect>
              </FormField>
            ) : null}
            <FormField
              label="Details (shown on the document)"
              htmlFor="reasonDetails"
              error={e.reasonDetails}
              className="sm:col-span-2 lg:col-span-4"
            >
              <Textarea
                id="reasonDetails"
                rows={2}
                value={values.reasonDetails}
                onChange={(ev) => set("reasonDetails", ev.target.value)}
              />
            </FormField>
            {type === "credit_note" && values.settlementMethod === "refund" ? (
              <>
                <FormField
                  label="Refund method"
                  htmlFor="refundMethod"
                  error={e["settlement.refundMethod"]}
                  className="sm:col-span-2"
                >
                  <NativeSelect
                    id="refundMethod"
                    value={values.refundMethod}
                    onChange={(ev) => set("refundMethod", ev.target.value as PaymentMethod | "")}
                  >
                    <option value="">Choose…</option>
                    {Object.entries(PAYMENT_METHOD_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </NativeSelect>
                </FormField>
                <FormField
                  label="Refund date"
                  htmlFor="refundDate"
                  error={e["settlement.refundDate"]}
                  className="sm:col-span-2"
                >
                  <Input
                    id="refundDate"
                    type="date"
                    value={values.refundDate}
                    onChange={(ev) => set("refundDate", ev.target.value)}
                  />
                </FormField>
              </>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Line items</CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => set("lines", [...values.lines, emptyFormLine()])}
          >
            <Plus className="mr-1 h-4 w-4" /> Add line
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {e.lines ? <Notice tone="error">{e.lines}</Notice> : null}
          {values.lines.map((line, i) => {
            const le = (field: string) => e[`lines.${i}.${field}`];
            const fid = (field: string) => `line-${line.id}-${field}`;
            const lineTotal = lineTotalsByIndex[i];
            return (
              <div
                key={line.id}
                className="grid gap-3 rounded-lg border border-border p-3 sm:grid-cols-12"
              >
                <FormField label="Description" htmlFor={fid("description")} error={le("description")} className="sm:col-span-12">
                  <Textarea
                    id={fid("description")}
                    rows={2}
                    value={line.description}
                    onChange={(ev) => setLine(i, { description: ev.target.value })}
                  />
                </FormField>
                <FormField label="Qty" htmlFor={fid("quantity")} error={le("quantity")} className="sm:col-span-2">
                  <Input
                    id={fid("quantity")}
                    inputMode="decimal"
                    value={line.quantity}
                    onChange={(ev) => setLine(i, { quantity: ev.target.value })}
                  />
                </FormField>
                <FormField label="Unit" htmlFor={fid("unit")} className="sm:col-span-2">
                  <NativeSelect
                    id={fid("unit")}
                    value={line.unit}
                    onChange={(ev) => setLine(i, { unit: ev.target.value as FormLine["unit"] })}
                  >
                    {UNITS.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </NativeSelect>
                </FormField>
                <FormField label="Unit price" htmlFor={fid("price")} error={le("unitPriceMinor")} className="sm:col-span-2">
                  <Input
                    id={fid("price")}
                    inputMode="decimal"
                    value={line.unitPrice}
                    onChange={(ev) => setLine(i, { unitPrice: ev.target.value })}
                  />
                </FormField>
                <FormField label="Discount" htmlFor={fid("discount")} error={le("discount") ?? le("discount.value")} className="sm:col-span-3">
                  <div className="flex gap-2">
                    <NativeSelect
                      aria-label="Discount type"
                      className="w-24 shrink-0"
                      value={line.discountKind}
                      onChange={(ev) =>
                        setLine(i, { discountKind: ev.target.value as FormLine["discountKind"] })
                      }
                    >
                      <option value="none">None</option>
                      <option value="percent">%</option>
                      <option value="amount">Amt</option>
                    </NativeSelect>
                    <Input
                      id={fid("discount")}
                      inputMode="decimal"
                      disabled={line.discountKind === "none"}
                      value={line.discountValue}
                      onChange={(ev) => setLine(i, { discountValue: ev.target.value })}
                    />
                  </div>
                </FormField>
                <FormField label="Tax %" htmlFor={fid("tax")} error={le("taxRate")} className="sm:col-span-1">
                  <Input
                    id={fid("tax")}
                    inputMode="decimal"
                    value={line.taxRate}
                    onChange={(ev) => setLine(i, { taxRate: ev.target.value })}
                  />
                </FormField>
                <div className="flex items-end justify-between gap-2 sm:col-span-2 sm:flex-col sm:items-end">
                  <span className="text-sm font-medium tabular-nums">
                    {lineTotal ? money(lineTotal.grossMinor - lineTotal.lineDiscountMinor) : "—"}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={values.lines.length === 1}
                    onClick={() => set("lines", values.lines.filter((_, j) => j !== i))}
                    aria-label="Remove line"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card>
          <CardContent className="space-y-4 pt-6">
            <FormField label="Notes (shown on the document)" htmlFor="notes" error={e.notes}>
              <Textarea
                id="notes"
                rows={3}
                value={values.notes}
                onChange={(ev) => set("notes", ev.target.value)}
              />
            </FormField>
            {hasDueDate ? (
              <FormField label="Terms" htmlFor="terms" error={e.terms}>
                <Textarea
                  id="terms"
                  rows={2}
                  value={values.terms}
                  onChange={(ev) => set("terms", ev.target.value)}
                />
              </FormField>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3 pt-6 text-sm">
            <FormField
              label="Document discount"
              htmlFor="documentDiscount"
              error={e.documentDiscount ?? e["documentDiscount.value"]}
            >
              <div className="flex gap-2">
                <NativeSelect
                  aria-label="Document discount type"
                  className="w-24 shrink-0"
                  value={values.documentDiscount.kind}
                  onChange={(ev) =>
                    set("documentDiscount", {
                      ...values.documentDiscount,
                      kind: ev.target.value as FormDiscount["kind"],
                    })
                  }
                >
                  <option value="none">None</option>
                  <option value="percent">%</option>
                  <option value="amount">Amt</option>
                </NativeSelect>
                <Input
                  id="documentDiscount"
                  inputMode="decimal"
                  disabled={values.documentDiscount.kind === "none"}
                  value={values.documentDiscount.value}
                  onChange={(ev) =>
                    set("documentDiscount", { ...values.documentDiscount, value: ev.target.value })
                  }
                />
              </div>
            </FormField>
            <dl className="space-y-1.5 border-t border-border pt-3 tabular-nums">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd>{money(totals.subtotalMinor)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Discounts</dt>
                <dd>−{money(totals.discountMinor)}</dd>
              </div>
              {totals.taxBreakdown.map((t) => (
                <div key={t.rate} className="flex justify-between">
                  <dt className="text-muted-foreground">Tax {t.rate}%</dt>
                  <dd>{money(t.taxMinor)}</dd>
                </div>
              ))}
              <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
                <dt>Total</dt>
                <dd>{money(totals.totalMinor)}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save draft"}
        </Button>
        <Button variant="outline" asChild>
          <Link href={cancelHref}>Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
