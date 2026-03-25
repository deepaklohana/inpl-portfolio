'use server';

type TriggerResult = {
  ok: boolean;
  path: string;
  status?: number;
  error?: string;
};

function getErrorMessage(e: unknown) {
  if (e instanceof Error) return e.message;
  return 'Request failed';
}

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
}

export async function triggerRevalidation(paths: string[]): Promise<TriggerResult[]> {
  const secret = process.env.REVALIDATION_SECRET;
  if (!secret) {
    return paths.map((path) => ({ ok: false, path, error: 'Missing REVALIDATION_SECRET' }));
  }

  const baseUrl = getBaseUrl();
  const unique = Array.from(new Set(paths)).filter(Boolean);

  const results = await Promise.all(
    unique.map(async (path) => {
      try {
        const res = await fetch(`${baseUrl}/api/revalidate`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ path, secret }),
          cache: 'no-store',
        });

        if (!res.ok) {
          return { ok: false, path, status: res.status, error: await res.text().catch(() => 'Request failed') };
        }

        return { ok: true, path, status: res.status };
      } catch (e: unknown) {
        return { ok: false, path, error: getErrorMessage(e) };
      }
    })
  );

  return results;
}

