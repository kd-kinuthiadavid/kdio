import { render } from "@react-email/render";
import { Resend } from "resend";

import AssessmentCompleteOwnerEmail from "@/emails/AssessmentCompleteOwner";
import AssessmentCompleteProspectEmail from "@/emails/AssessmentCompleteProspect";
import AssessmentResumeNudgeEmail from "@/emails/AssessmentResumeNudge";
import {
  buildCalNotes,
  callOpenerLine,
} from "@/lib/assessment/scoring";
import type { ServiceId, TierBandId } from "@/lib/assessment/types";
import {
  calUrlWithPrefill,
  getDiscoveryCallUrl,
  getNurtureGuideUrl,
  getStrategyCallUrl,
} from "@/lib/cal";
import { getSiteUrl } from "@/lib/site-url";

const SERVICE_LABEL: Record<ServiceId, string> = {
  aiIntegration: "AI integration & architecture",
  secureAi: "Secure & compliant AI deployment",
  aiNative: "AI-native product engineering",
  agenticOps: "Agentic workflow automation",
  mlopsRescue: "MLOps & infrastructure rescue",
  fractionalCto: "Fractional CTO & technical advisory",
};

function resend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

function fromAddress() {
  return process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
}

function notifyAddress() {
  return process.env.NOTIFY_EMAIL || process.env.RESEND_NOTIFY_TO;
}

export async function sendCompletionEmails(args: {
  prospectEmail: string;
  locale: string;
  total: number;
  tier: TierBandId;
  serviceId: ServiceId;
  submissionId: string;
}) {
  const client = resend();
  if (!client) {
    console.warn("RESEND_API_KEY missing — skip email send");
    return;
  }
  const notify = notifyAddress();
  const site = getSiteUrl();
  const notes = buildCalNotes({
    email: args.prospectEmail,
    tier: args.tier,
    serviceId: args.serviceId,
    total: args.total,
  });

  let primaryUrl: string;
  let primaryLabel: string;
  let secondaryUrl: string | undefined;
  let secondaryLabel: string | undefined;

  if (args.tier === "strong") {
    primaryUrl = calUrlWithPrefill(getStrategyCallUrl(), {
      email: args.prospectEmail,
      notes,
    });
    primaryLabel = "Book a strategy call";
    secondaryUrl = calUrlWithPrefill(getDiscoveryCallUrl(), {
      email: args.prospectEmail,
      notes,
    });
    secondaryLabel = "Prefer a discovery call instead";
  } else if (args.tier === "good") {
    primaryUrl = calUrlWithPrefill(getDiscoveryCallUrl(), {
      email: args.prospectEmail,
      notes,
    });
    primaryLabel = "Book a free discovery call";
    secondaryUrl = calUrlWithPrefill(getStrategyCallUrl(), {
      email: args.prospectEmail,
      notes,
    });
    secondaryLabel = "Ready for a deeper strategy session";
  } else if (args.tier === "nurture") {
    primaryUrl = getNurtureGuideUrl();
    primaryLabel = "Get the guide & next steps";
    secondaryUrl = calUrlWithPrefill(getDiscoveryCallUrl(), {
      email: args.prospectEmail,
      notes,
    });
    secondaryLabel = "Talk when you are ready";
  } else {
    primaryUrl = site;
    primaryLabel = "Back to the site";
    secondaryUrl = undefined;
    secondaryLabel = undefined;
  }

  const serviceLine = SERVICE_LABEL[args.serviceId];
  const tierLine = `Fit band: ${args.tier} (${args.total}/100)`;
  const intro = `Thanks for completing the assessment. Based on your answers, the clearest place to start is **${serviceLine}**.`;
  const nextSteps =
    args.tier === "notFit"
      ? "Based on this pass, we are probably not the right engagement right now — but you will still find useful material on the site."
      : "Use the button below as the fastest path — your context is pre-filled so we skip the repeat questions on the call.";

  const prospectHtml = await render(
    AssessmentCompleteProspectEmail({
      preview: `Your results — ${serviceLine}`,
      headline: "Your assessment results",
      intro,
      serviceLine,
      tierLine,
      nextSteps,
      primaryCtaLabel: primaryLabel,
      primaryCtaUrl: primaryUrl,
      secondaryCtaLabel: secondaryLabel,
      secondaryCtaUrl: secondaryUrl,
      siteUrl: site,
    })
  );

  await client.emails.send({
    from: fromAddress(),
    to: args.prospectEmail,
    subject: "Your AI consulting assessment results",
    html: prospectHtml,
  });

  if (notify) {
    const opener = callOpenerLine({
      tier: args.tier,
      serviceId: args.serviceId,
      total: args.total,
    });
    const adminUrl = `${site}/admin/assessments?id=${args.submissionId}`;
    const ownerHtml = await render(
      AssessmentCompleteOwnerEmail({
        preview: `Completed: ${args.prospectEmail}`,
        opener,
        email: args.prospectEmail,
        locale: args.locale,
        total: args.total,
        tier: args.tier,
        serviceId: args.serviceId,
        adminUrl,
      })
    );
    await client.emails.send({
      from: fromAddress(),
      to: notify,
      subject: `[Assessment] ${args.prospectEmail} · ${args.tier} · ${args.total}/100`,
      html: ownerHtml,
    });
  }
}

export async function sendResumeNudgeEmail(args: {
  to: string;
  locale: string;
  resumeParam: string;
}) {
  const client = resend();
  if (!client) {
    console.warn("RESEND_API_KEY missing — skip resume nudge");
    return;
  }
  const site = getSiteUrl();
  const pathLocale = args.locale || "en";
  const resumeUrl = `${site}/${pathLocale}/assessment?resume=${encodeURIComponent(args.resumeParam)}`;

  const html = await render(
    AssessmentResumeNudgeEmail({
      preview: "Pick up your assessment where you left off",
      headline: "You are almost there",
      body: "You started the fit assessment but did not finish. One more pass gives you a clear read on fit, recommended service, and the right next step — usually under three minutes.",
      resumeUrl,
      ctaLabel: "Resume assessment",
    })
  );

  await client.emails.send({
    from: fromAddress(),
    to: args.to,
    subject: "Resume your assessment",
    html,
  });
}
