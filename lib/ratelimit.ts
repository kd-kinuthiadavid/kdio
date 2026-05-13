import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

const assessmentLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(40, "10 m"),
      prefix: "assess",
    })
  : null;

const adminLoginLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(8, "15 m"),
      prefix: "admin_login",
    })
  : null;

export async function rateLimitAssessment(identifier: string) {
  if (!assessmentLimiter) return { success: true as const };
  return assessmentLimiter.limit(identifier);
}

export async function rateLimitAdminLogin(identifier: string) {
  if (!adminLoginLimiter) return { success: true as const };
  return adminLoginLimiter.limit(identifier);
}

export function clientIp(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown"
  );
}
