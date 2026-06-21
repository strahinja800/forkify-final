import { TIMEOUT_SEC } from './config';

const timeout = (s: number): Promise<never> =>
  new Promise((_, reject) =>
    setTimeout(
      () => reject(new Error(`Request took too long! Timeout after ${s} seconds`)),
      s * 1000
    )
  );

export async function ajax(url: string, uploadData?: unknown) {
  const fetchPro = uploadData
    ? fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(uploadData),
      })
    : fetch(url);

  const response = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
  const data = await response.json();

  if (!response.ok) throw new Error(`${data.message} (${response.status})`);

  return data;
}
