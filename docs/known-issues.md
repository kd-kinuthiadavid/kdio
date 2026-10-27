# Known issues

Open bugs and risks, highest priority first. Remove an entry when its fix ships, and add new ones in priority order.

| Severity | Meaning |
| --- | --- |
| High | Visible breakage for visitors or prospects, or a security exposure |
| Medium | Wrong or degraded behavior with a workaround, or risk that depends on configuration |
| Low | Edge cases, cleanup, deprecations |

| # | Issue | Severity | Area |
| --- | --- | --- | --- |
| 1 | Localized 404 pages render an empty body on the server | High | Routing |
| 2 | Rate limiting is silently off without Redis credentials | Medium | Security |
| 3 | A failed autosave doesn't stop the assessment, and raw server errors are shown | Medium | Assessment |
| 4 | Components created during render reset their state | Medium | UI |
| 5 | Assessment flow and its emails are English in every locale | Medium | i18n |
| 6 | Failed completion emails are logged but never retried | Low | Email |
| 7 | Parallel completion requests both write the submission | Low | Assessment |
| 8 | `setState` called synchronously inside effects | Low | UI |
| 9 | Deprecated `middleware.ts` file name and Sentry options | Low | Tooling |
| 10 | `app/global-error.tsx` renders `<html>` without `lang` | Low | Accessibility |

## 1. Localized 404 pages render an empty body on the server

- **Severity:** High
- **Where:** `app/[locale]/not-found.tsx`, `app/[locale]/[...rest]/page.tsx`, `app/[locale]/work/page.tsx`
- **Symptom:** Any `notFound()` under `[locale]`, such as an unknown `/en/...` URL or `/en/work` while the track record is disabled, returns Next's error shell (`__next_error__`). The localized 404 appears only after JavaScript loads. Status 404 and `noindex` are correct, so indexing isn't affected, but visitors without JavaScript and some link previewers see a blank page.
- **Notes:** This predates the v0.7.0 layout change; the v0.6.0 build behaves the same. The error (`NEXT_HTTP_ERROR_FALLBACK;404`) escapes the not-found boundary during server rendering. Likely an interaction between Next 16.2 and `next-intl` with `<html>` rendered below the root layout. Next step: reproduce in a minimal app, then check the Next.js and `next-intl` issue trackers.

## 2. Rate limiting is silently off without Redis credentials

- **Severity:** Medium (High if the variables are missing in production)
- **Where:** `lib/ratelimit.ts`
- **Symptom:** If `KV_REST_API_URL`/`KV_REST_API_TOKEN` (or the `UPSTASH_*` equivalents) are unset, `rateLimitAssessment` and `rateLimitAdminLogin` allow every request, so admin login has no brute-force protection.
- **Fix:** Confirm both variables are set in Vercel production. Consider logging a warning, or failing closed for admin login in production, when Redis isn't configured.

## 3. A failed autosave doesn't stop the assessment, and raw server errors are shown

- **Severity:** Medium
- **Where:** `app/[locale]/assessment/AssessmentClient.tsx` (`patchAnswers`, `handleNext`)
- **Symptom:** `patchAnswers` catches its own errors, so `handleNext` advances even when saving failed, and the error shows over the next question. Error text comes straight from the API (`Too many requests`, `Invalid body`), in English regardless of locale.
- **Fix:** Have `patchAnswers` return success and only advance on success. Map API errors to translated messages.

## 4. Components created during render reset their state

- **Severity:** Medium
- **Where:** `app/[locale]/services/_components/ServiceItem.tsx`, `app/[locale]/method/_components/MethodItem.tsx` (the header components were fixed with the navigation overlap fix)
- **Symptom:** `motion.create(...)` runs inside the component body, so every render creates a new component type and React remounts that subtree. Accordion state can reset and animations can replay on re-render. Flagged by `react-hooks/static-components`.
- **Fix:** Move the `motion.create(...)` calls to module scope.

## 5. Assessment flow and its emails are English in every locale

- **Severity:** Medium
- **Where:** the `assessment` namespace in `messages/*.json`, `lib/email/send-assessment.ts`
- **Symptom:** `/es/assessment`, `/de/assessment` and the other locales show English copy, and the results, owner and resume emails are always English even though `locale` is stored.
- **Fix:** Translate the `assessment` messages, and pass `locale` into the email templates.

## 6. Failed completion emails are logged but never retried

- **Severity:** Low
- **Where:** `lib/email/send-assessment.ts` (`sendCompletionEmails`)
- **Symptom:** When Resend rejects the results or owner email, the error is now logged, but nothing resends it. The prospect still sees their results on the page.
- **Fix:** Record send status on the submission (for example a `results_email_sent_at` column) and retry from a cron, or surface failures in the admin assessments page.

## 7. Parallel completion requests both write the submission

- **Severity:** Low
- **Where:** `app/api/assessment/[id]/complete/route.ts`
- **Symptom:** The route reads `status`, then updates in a separate statement, so two simultaneous requests (two tabs, a retry) both pass the check. Duplicate emails are now prevented by Resend idempotency keys, which last 24 hours, but the row is written twice.
- **Fix:** Make the update conditional on `status = 'draft'` with `returning`, and only send emails when a row was updated.

## 8. `setState` called synchronously inside effects

- **Severity:** Low
- **Where:** `components/shared/MobileNav.tsx` (closing the menu on route change), `components/shared/ThemeToggle.tsx` (mounted flag)
- **Symptom:** Extra cascading renders, flagged by `react-hooks/set-state-in-effect`. No visible bug today.
- **Fix:** Close the menu in the link click handlers, and use `useSyncExternalStore` or `next-themes`' own mounted pattern for the toggle.

## 9. Deprecated `middleware.ts` file name and Sentry options

- **Severity:** Low
- **Where:** `middleware.ts`, `next.config.mjs`
- **Symptom:** Next 16 warns that `middleware` should be renamed `proxy`. Sentry warns that `disableLogger` and `automaticVercelMonitors` are deprecated. Both still work.
- **Fix:** Rename to `proxy.ts` (check the Sentry tunnel and matcher still work), and move the Sentry options to `webpack.treeshake.removeDebugLogging` and `webpack.automaticVercelMonitors`.

## 10. `app/global-error.tsx` renders `<html>` without `lang`

- **Severity:** Low
- **Where:** `app/global-error.tsx`
- **Symptom:** Screen readers can't determine the language of the fallback error page.
- **Fix:** Add `lang="en"`.
