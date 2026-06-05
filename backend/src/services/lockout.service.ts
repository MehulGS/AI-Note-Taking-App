type AttemptRecord = {
  failedAttempts: number;
  lockedUntil?: number;
};

const records = new Map<string, AttemptRecord>();
const maxFailedAttempts = 5;
const lockoutMs = 15 * 60 * 1000;

export function getAttemptKey(token: string, ip: string) {
  return `${token}:${ip}`;
}

export function isLocked(key: string) {
  const record = records.get(key);
  return Boolean(record?.lockedUntil && record.lockedUntil > Date.now());
}

export function recordFailedAttempt(key: string) {
  const current = records.get(key) ?? { failedAttempts: 0 };
  current.failedAttempts += 1;

  if (current.failedAttempts >= maxFailedAttempts) {
    current.lockedUntil = Date.now() + lockoutMs;
  }

  records.set(key, current);
}

export function clearAttempts(key: string) {
  records.delete(key);
}
