import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  daysBetween,
  pendingReminderStage,
  stageCopy,
  type ReminderInput,
} from "./reminders.ts";

const base: ReminderInput = {
  issueDate: "2026-10-01",
  dueDate: "2026-10-31",
  outstandingMinor: 100_00,
  paused: false,
  sentStages: new Set(),
  lastContactOn: "2026-10-01",
  today: "2026-10-31",
};

const at = (today: string, extra: Partial<ReminderInput> = {}) =>
  pendingReminderStage({ ...base, today, ...extra });

describe("daysBetween", () => {
  it("counts whole days in both directions", () => {
    assert.equal(daysBetween("2026-10-31", "2026-11-03"), 3);
    assert.equal(daysBetween("2026-11-03", "2026-10-31"), -3);
    assert.equal(daysBetween("2026-03-28", "2026-03-30"), 2);
  });
});

describe("pendingReminderStage", () => {
  it("returns nothing before the first stage", () => {
    assert.equal(at("2026-10-27"), null);
  });

  it("hits each stage on its boundary day", () => {
    assert.equal(at("2026-10-28"), "upcoming");
    assert.equal(at("2026-10-31"), "due");
    assert.equal(at("2026-11-03"), "overdue_1");
    assert.equal(at("2026-11-10"), "overdue_2");
    assert.equal(at("2026-11-21"), "final");
  });

  it("does not move to the next stage a day early", () => {
    assert.equal(at("2026-11-02", { sentStages: new Set(["due"]) }), null);
    assert.equal(at("2026-11-09", { sentStages: new Set(["overdue_1"]) }), null);
    assert.equal(at("2026-11-20", { sentStages: new Set(["overdue_2"]) }), null);
  });

  it("stops after the final stage", () => {
    assert.equal(at("2026-12-31", { sentStages: new Set(["final"]) }), null);
  });

  it("sends only the latest stage after missed days", () => {
    assert.equal(at("2026-11-12", { sentStages: new Set(["upcoming"]) }), "overdue_2");
  });

  it("does not repeat a stage already sent", () => {
    assert.equal(at("2026-11-01", { sentStages: new Set(["due"]) }), null);
  });

  it("never reminds about settled or paused invoices", () => {
    assert.equal(at("2026-11-03", { outstandingMinor: 0 }), null);
    assert.equal(at("2026-11-03", { outstandingMinor: -500 }), null);
    assert.equal(at("2026-11-03", { paused: true }), null);
  });

  it("returns nothing without a due date", () => {
    assert.equal(at("2026-11-03", { dueDate: undefined }), null);
  });

  it("keeps a two-day gap after any email", () => {
    assert.equal(at("2026-11-03", { lastContactOn: "2026-11-02" }), null);
    assert.equal(at("2026-11-03", { lastContactOn: "2026-11-03" }), null);
    assert.equal(at("2026-11-03", { lastContactOn: "2026-11-01" }), "overdue_1");
  });

  it("skips the heads-up when payment terms are under seven days", () => {
    const short = { issueDate: "2026-10-26", lastContactOn: "2026-10-26" };
    assert.equal(at("2026-10-28", short), null);
    assert.equal(at("2026-10-31", short), "due");
  });

  it("keeps the heads-up for seven-day terms", () => {
    assert.equal(at("2026-10-28", { issueDate: "2026-10-24", lastContactOn: "2026-10-24" }), "upcoming");
  });
});

describe("stageCopy", () => {
  const facts = { number: "INV-2026-0014", outstanding: "USD 1,200.00", dueOn: "31 Oct 2026" };

  it("words the subject by days past due", () => {
    assert.equal(
      stageCopy("upcoming", { ...facts, daysPastDue: -3 }).subject,
      "Reminder: Invoice INV-2026-0014 is due on 31 Oct 2026"
    );
    assert.equal(
      stageCopy("due", { ...facts, daysPastDue: 0 }).subject,
      "Reminder: Invoice INV-2026-0014 is due today"
    );
    assert.equal(
      stageCopy("overdue_2", { ...facts, daysPastDue: 10 }).subject,
      "Reminder: Invoice INV-2026-0014 is 10 days overdue"
    );
    assert.equal(
      stageCopy("final", { ...facts, daysPastDue: 21 }).subject,
      "Final reminder: Invoice INV-2026-0014 is 21 days overdue"
    );
  });

  it("picks a manual reminder's tone from the dates", () => {
    assert.match(stageCopy("manual", { ...facts, daysPastDue: 1 }).intro, /still outstanding/);
    assert.match(stageCopy("manual", { ...facts, daysPastDue: 0 }).intro, /due today/);
  });
});
