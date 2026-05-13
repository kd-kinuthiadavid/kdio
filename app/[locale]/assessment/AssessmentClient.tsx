"use client";

import { decodeJwt } from "jose";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import ContentSurface from "@/components/shared/ContentSurface";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ASSESSMENT_QUESTIONS } from "@/lib/assessment/questions";
import {
  buildCalNotes,
} from "@/lib/assessment/scoring";
import type { ServiceId, TierBandId } from "@/lib/assessment/types";
import {
  calUrlWithPrefill,
  getDiscoveryCallUrl,
  getNurtureGuideUrl,
  getStrategyCallUrl,
} from "@/lib/cal";
import {
  containerVariants,
  itemVariants,
  navItemVariants,
} from "@/app/motionVariants";

type Step = "intro" | "email" | "questions" | "results";

function firstUnansweredIndex(answers: Record<string, unknown>): number {
  for (let i = 0; i < ASSESSMENT_QUESTIONS.length; i++) {
    const q = ASSESSMENT_QUESTIONS[i];
    const v = answers[q.id];
    if (v === undefined || v === null) return i;
    if (q.type === "scale") {
      const n = typeof v === "number" ? v : Number(v);
      if (!Number.isFinite(n)) return i;
    }
  }
  return ASSESSMENT_QUESTIONS.length;
}

export default function AssessmentClient() {
  const t = useTranslations("assessment");
  const tServices = useTranslations("services");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const resumeLoaded = useRef(false);

  const [step, setStep] = useState<Step>("intro");
  const [qIndex, setQIndex] = useState(0);
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [resumeToken, setResumeToken] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    totalScore: number;
    tier: TierBandId;
    serviceId: ServiceId;
  } | null>(null);

  const current = ASSESSMENT_QUESTIONS[qIndex];
  const progressPct = Math.round(
    ((qIndex + (step === "results" ? 1 : 0)) / ASSESSMENT_QUESTIONS.length) * 100
  );

  const patchAnswers = useCallback(
    async (next: Record<string, string | number>) => {
      if (!sessionId || !resumeToken) return;
      setBusy(true);
      setError(null);
      try {
        const res = await fetch(`/api/assessment/${sessionId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resumeToken}`,
          },
          body: JSON.stringify({ token: resumeToken, answers: next }),
        });
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error((j as { error?: string }).error || "save failed");
        }
        const data = (await res.json()) as { answers: Record<string, unknown> };
        setAnswers(data.answers as Record<string, string | number>);
      } catch (e) {
        setError(e instanceof Error ? e.message : t("errorGeneric"));
      } finally {
        setBusy(false);
      }
    },
    [sessionId, resumeToken, t]
  );

  useEffect(() => {
    const resume = searchParams.get("resume");
    if (!resume || resumeLoaded.current) return;
    resumeLoaded.current = true;
    (async () => {
      setBusy(true);
      setError(null);
      try {
        const claims = decodeJwt(resume);
        const id = claims.sub as string | undefined;
        if (!id) throw new Error("Invalid resume link");
        const res = await fetch(`/api/assessment/${id}`, {
          headers: { Authorization: `Bearer ${resume}` },
        });
        if (!res.ok) throw new Error(t("errorGeneric"));
        const data = (await res.json()) as {
          id: string;
          email: string | null;
          status: string;
          answers: Record<string, unknown>;
          totalScore: number | null;
          tier: string | null;
          serviceId: string | null;
        };
        setSessionId(data.id);
        setResumeToken(resume);
        if (data.email) setEmail(data.email);
        const merged = { ...data.answers } as Record<string, string | number>;
        setAnswers(merged);
        if (data.status === "completed" && data.totalScore != null && data.tier && data.serviceId) {
          setResult({
            totalScore: data.totalScore,
            tier: data.tier as TierBandId,
            serviceId: data.serviceId as ServiceId,
          });
          setStep("results");
          return;
        }
        setConsent(true);
        setStep("questions");
        setQIndex(firstUnansweredIndex(merged));
      } catch (e) {
        setError(e instanceof Error ? e.message : t("errorGeneric"));
      } finally {
        setBusy(false);
      }
    })();
  }, [searchParams, t]);

  const blockTitle = useMemo(() => {
    if (!current) return "";
    if (current.block === "context") return t("blockContext");
    if (current.block === "problem") return t("blockProblem");
    return t("blockReadiness");
  }, [current, t]);

  const showBlockHeading =
    qIndex === 0 ||
    ASSESSMENT_QUESTIONS[qIndex - 1]?.block !== current?.block;

  async function handleStartEmail() {
    setError(null);
    if (!email || !consent) {
      setError(t("errorGeneric"));
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/assessment/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          locale,
          consent: true as const,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error((j as { error?: string }).error || t("errorGeneric"));
      }
      const data = (await res.json()) as {
        id: string;
        resumeToken: string;
      };
      setSessionId(data.id);
      setResumeToken(data.resumeToken);
      setStep("questions");
      setQIndex(0);
    } catch (e) {
      setError(e instanceof Error ? e.message : t("errorGeneric"));
    } finally {
      setBusy(false);
    }
  }

  function currentValue(): string | number | undefined {
    if (!current) return undefined;
    return answers[current.id];
  }

  function setCurrentValue(v: string | number) {
    if (!current) return;
    setAnswers((prev) => ({ ...prev, [current.id]: v }));
  }

  async function handleNext() {
    setError(null);
    if (!current) return;
    let v = currentValue();
    if (current.type === "scale") {
      if (v === undefined || v === null || v === "") v = 5;
    }
    if (v === undefined || v === "") {
      setError(t("errorGeneric"));
      return;
    }
    if (!sessionId || !resumeToken) return;
    const nextAnswers = { ...answers, [current.id]: v };
    await patchAnswers(nextAnswers);
    if (qIndex >= ASSESSMENT_QUESTIONS.length - 1) {
      setBusy(true);
      try {
        const res = await fetch(`/api/assessment/${sessionId}/complete`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: resumeToken, answers: nextAnswers }),
        });
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error((j as { error?: string }).error || t("errorGeneric"));
        }
        const data = (await res.json()) as {
          totalScore: number;
          tier: TierBandId;
          serviceId: ServiceId;
        };
        setResult(data);
        setStep("results");
      } catch (e) {
        setError(e instanceof Error ? e.message : t("errorGeneric"));
      } finally {
        setBusy(false);
      }
      return;
    }
    setQIndex((i) => i + 1);
  }

  function handleBack() {
    setError(null);
    if (qIndex > 0) setQIndex((i) => i - 1);
    else if (step === "questions") setStep("email");
    else if (step === "email") setStep("intro");
  }

  const calNotes = useMemo(() => {
    if (!result || !email) return "";
    return buildCalNotes({
      email,
      tier: result.tier,
      serviceId: result.serviceId,
      total: result.totalScore,
    });
  }, [result, email]);

  return (
    <ContentSurface className="w-full min-w-0 max-w-[min(100%,clamp(22rem,92vw,40rem))]">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="flex w-full flex-col gap-y-8 sm:gap-y-10"
      >
        <motion.div variants={containerVariants} className="flex flex-col gap-y-3">
          <motion.h1
            variants={itemVariants}
            className="text-balance font-semibold text-3xl leading-tight sm:text-4xl"
          >
            {t("title")}
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="max-w-prose text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            {t("subtitle")}
          </motion.p>
        </motion.div>

        {step !== "intro" && step !== "email" && (
          <motion.div variants={itemVariants}>
            <Progress value={Math.min(100, progressPct)} className="h-2" />
          </motion.div>
        )}

        {error ? (
          <motion.p
            variants={itemVariants}
            className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            role="alert"
          >
            {error}
          </motion.p>
        ) : null}

        {busy && step !== "results" ? (
          <motion.p variants={itemVariants} className="text-sm text-muted-foreground" aria-live="polite">
            {step === "intro" && searchParams.get("resume") ? t("resumeLoading") : t("saving")}
          </motion.p>
        ) : null}

        {step === "intro" && (
          <motion.div variants={containerVariants} className="flex flex-col gap-y-6">
            <motion.p variants={itemVariants} className="text-base leading-relaxed">
              {t("introLead")}
            </motion.p>
            <motion.div variants={navItemVariants}>
              <Button type="button" className="w-full py-6 text-base" onClick={() => setStep("email")}>
                {t("startCta")}
              </Button>
            </motion.div>
          </motion.div>
        )}

        {step === "email" && (
          <motion.div variants={containerVariants} className="flex flex-col gap-y-5">
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="assess-email">{t("emailLabel")}</Label>
              <Input
                id="assess-email"
                type="email"
                autoComplete="email"
                placeholder={t("emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-base"
              />
            </div>
            <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1 size-4 shrink-0 rounded border border-input"
              />
              <span>{t("consentLabel")}</span>
            </label>
            <motion.div variants={navItemVariants} className="flex flex-col gap-3 sm:flex-row">
              <Button type="button" variant="outline" className="w-full py-5" onClick={handleBack}>
                {t("backCta")}
              </Button>
              <Button
                type="button"
                className="w-full py-5"
                disabled={busy || !email || !consent}
                onClick={handleStartEmail}
              >
                {t("startCta")}
              </Button>
            </motion.div>
          </motion.div>
        )}

        {step === "questions" && current && (
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-y-6"
          >
            {showBlockHeading ? (
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                {blockTitle}
              </p>
            ) : null}
            <h2 className="text-xl font-semibold leading-snug sm:text-2xl">
              {t(`questions.${current.id}.title` as Parameters<typeof t>[0])}
            </h2>

            {current.type === "single" ? (
              <RadioGroup
                value={typeof currentValue() === "string" ? (currentValue() as string) : ""}
                onValueChange={(v) => setCurrentValue(v)}
                className="flex flex-col gap-3"
              >
                {current.options.map((opt) => (
                  <label
                    key={opt.id}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-background/50 px-4 py-3 transition-colors hover:bg-accent/20 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-accent/25"
                  >
                    <RadioGroupItem value={opt.id} id={`${current.id}-${opt.id}`} />
                    <span className="text-base leading-snug">
                      {t(`questions.${current.id}.options.${opt.id}` as Parameters<typeof t>[0])}
                    </span>
                  </label>
                ))}
              </RadioGroup>
            ) : (
              <div className="flex flex-col gap-y-3">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{t(`questions.${current.id}.scaleLow` as Parameters<typeof t>[0])}</span>
                  <span>{t(`questions.${current.id}.scaleHigh` as Parameters<typeof t>[0])}</span>
                </div>
                <input
                  type="range"
                  min={current.min}
                  max={current.max}
                  step={1}
                  value={
                    typeof currentValue() === "number"
                      ? (currentValue() as number)
                      : 5
                  }
                  onChange={(e) => setCurrentValue(Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <p className="text-center text-sm font-medium tabular-nums">
                  {typeof currentValue() === "number" ? currentValue() : 5} / {current.max}
                </p>
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button type="button" variant="outline" className="w-full py-5" onClick={handleBack}>
                {t("backCta")}
              </Button>
              <Button type="button" className="w-full py-5" disabled={busy} onClick={handleNext}>
                {qIndex >= ASSESSMENT_QUESTIONS.length - 1 ? t("submitCta") : t("nextCta")}
              </Button>
            </div>
          </motion.div>
        )}

        {step === "results" && result && (
          <motion.div variants={containerVariants} className="flex flex-col gap-y-6">
            <motion.h2 variants={itemVariants} className="text-2xl font-semibold">
              {t("resultsTitle")}
            </motion.h2>
            <motion.p variants={itemVariants} className="text-lg text-muted-foreground">
              {t("resultsScore", { score: result.totalScore })}
            </motion.p>
            <motion.div
              variants={itemVariants}
              className="rounded-lg border border-border bg-background/50 p-5"
            >
              <p className="text-sm font-medium text-muted-foreground">{t("resultsService")}</p>
              <p className="text-lg font-semibold text-primary">
                {tServices(`items.${result.serviceId}.name` as Parameters<typeof tServices>[0])}
              </p>
              <p className="mt-3 text-sm text-muted-foreground">{t("resultsTier")}</p>
              <p className="text-base font-medium">{t(`tiers.${result.tier}.label`)}</p>
              <p className="mt-3 text-base leading-relaxed">{t(`tiers.${result.tier}.body`)}</p>
            </motion.div>

            {result.tier === "notFit" ? (
              <p className="text-base leading-relaxed text-muted-foreground">{t("resultsNotFit")}</p>
            ) : (
              <div className="flex flex-col gap-3">
                {result.tier === "strong" ? (
                  <Button
                    type="button"
                    className="w-full py-6 text-base"
                    onClick={() =>
                      window.open(
                        calUrlWithPrefill(getStrategyCallUrl(), {
                          email,
                          notes: calNotes,
                        }),
                        "_blank"
                      )
                    }
                  >
                    {t("resultsCtaStrategy")}
                  </Button>
                ) : null}
                {result.tier === "good" || result.tier === "strong" ? (
                  <Button
                    type="button"
                    variant={result.tier === "good" ? "default" : "outline"}
                    className="w-full py-6 text-base"
                    onClick={() =>
                      window.open(
                        calUrlWithPrefill(getDiscoveryCallUrl(), {
                          email,
                          notes: calNotes,
                        }),
                        "_blank"
                      )
                    }
                  >
                    {t("resultsCtaDiscovery")}
                  </Button>
                ) : null}
                {result.tier === "nurture" ? (
                  <>
                    <Button
                      type="button"
                      className="w-full py-6 text-base"
                      onClick={() => window.open(getNurtureGuideUrl(), "_blank")}
                    >
                      {t("resultsCtaGuide")}
                    </Button>
                    <p className="text-sm text-muted-foreground">{t("nurtureHint")}</p>
                  </>
                ) : null}
              </div>
            )}
          </motion.div>
        )}

        <motion.footer variants={itemVariants} className="border-t border-border pt-8 text-sm leading-relaxed text-muted-foreground">
          <p className="font-semibold text-foreground">{t("privacyTitle")}</p>
          <p className="mt-2">{t("privacyBody")}</p>
          <p className="mt-4 text-xs leading-relaxed opacity-90">{t("triagePlaybook")}</p>
        </motion.footer>
      </motion.div>
    </ContentSurface>
  );
}
