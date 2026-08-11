import { NextRequest, NextResponse } from 'next/server';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

// In-memory sliding window rate limiter store
const rateLimitMap = new Map<string, RateLimitRecord>();

// Cleanup stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000);

export function getClientIp(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? req.headers.get('x-real-ip')
    ?? '127.0.0.1';
}

export function checkRateLimit(
  req: NextRequest,
  keyPrefix: string,
  maxRequests: number = 10,
  windowMs: number = 60 * 1000
): { isAllowed: boolean; response?: NextResponse } {
  const ip = getClientIp(req);
  const key = `${keyPrefix}:${ip}`;
  const now = Date.now();

  let record = rateLimitMap.get(key);

  if (!record || now > record.resetTime) {
    record = {
      count: 1,
      resetTime: now + windowMs,
    };
    rateLimitMap.set(key, record);
    return { isAllowed: true };
  }

  if (record.count >= maxRequests) {
    const retryAfter = Math.ceil((record.resetTime - now) / 1000);
    const response = NextResponse.json(
      { error: 'Too Many Requests', retryAfterSeconds: retryAfter },
      {
        status: 429,
        headers: {
          'Retry-After': retryAfter.toString(),
          'X-RateLimit-Limit': maxRequests.toString(),
          'X-RateLimit-Remaining': '0',
        },
      }
    );
    return { isAllowed: false, response };
  }

  record.count += 1;
  return { isAllowed: true };
}
