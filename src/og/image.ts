import {
  IMAGE_FETCH_LIMITS,
  SUPPORTED_IMAGE_TYPES,
} from "./config";

const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308]);

export type FetchedImage = {
  contentType: string;
  data: Uint8Array;
  url: string;
};

export type FetchImageOptions = {
  fetchImpl?: typeof fetch;
  maxBytes?: number;
  maxRedirects?: number;
  timeoutMs?: number;
};

export function parseImageUrl(value: string): URL | null {
  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase().replace(/^\[|\]$/g, "");

    if (
      url.protocol !== "https:" ||
      !hostname ||
      url.username ||
      url.password ||
      (url.port && url.port !== "443") ||
      isPrivateHostname(hostname)
    ) {
      return null;
    }

    return url;
  } catch {
    return null;
  }
}

export async function fetchImage(
  value: string,
  options: FetchImageOptions = {},
): Promise<FetchedImage | null> {
  let currentUrl = parseImageUrl(value);
  if (!currentUrl) return null;

  const fetchImpl = options.fetchImpl ?? globalThis.fetch;
  const maxBytes = options.maxBytes ?? IMAGE_FETCH_LIMITS.maxBytes;
  const maxRedirects = options.maxRedirects ?? IMAGE_FETCH_LIMITS.maxRedirects;
  const timeoutMs = options.timeoutMs ?? IMAGE_FETCH_LIMITS.timeoutMs;

  for (let redirectCount = 0; redirectCount <= maxRedirects; redirectCount += 1) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetchImpl(currentUrl.toString(), {
        redirect: "manual",
        signal: controller.signal,
      });

      if (REDIRECT_STATUSES.has(response.status)) {
        const location = response.headers.get("location");
        await cancelBody(response);

        if (!location || redirectCount === maxRedirects) return null;

        const redirectUrl = parseImageUrl(new URL(location, currentUrl).toString());
        if (!redirectUrl) return null;

        currentUrl = redirectUrl;
        continue;
      }

      if (!response.ok) {
        await cancelBody(response);
        return null;
      }

      const contentType = response.headers
        .get("content-type")
        ?.split(";", 1)[0]
        .trim()
        .toLowerCase();

      if (!contentType || !SUPPORTED_IMAGE_TYPES.has(contentType)) {
        await cancelBody(response);
        return null;
      }

      const declaredLength = Number(response.headers.get("content-length"));
      if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
        await cancelBody(response);
        return null;
      }

      const data = await readBodyWithinLimit(response.body, maxBytes);
      if (!data) return null;

      return {
        contentType,
        data,
        url: currentUrl.toString(),
      };
    } catch {
      return null;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  return null;
}

async function readBodyWithinLimit(
  body: ReadableStream<Uint8Array> | null,
  maxBytes: number,
): Promise<Uint8Array | null> {
  if (!body) return null;

  const reader = body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      totalBytes += value.byteLength;
      if (totalBytes > maxBytes) {
        await reader.cancel();
        return null;
      }

      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const data = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    data.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return data;
}

async function cancelBody(response: Response): Promise<void> {
  if (!response.body) return;

  try {
    await response.body.cancel();
  } catch {
    // The response is already being rejected; cancellation failure is harmless.
  }
}

function isPrivateHostname(hostname: string): boolean {
  const normalizedHostname = hostname.replace(/\.$/, "");

  if (
    normalizedHostname === "localhost" ||
    normalizedHostname.endsWith(".localhost") ||
    normalizedHostname.endsWith(".local") ||
    normalizedHostname.endsWith(".internal") ||
    normalizedHostname === "::1" ||
    normalizedHostname.startsWith("fc") ||
    normalizedHostname.startsWith("fd") ||
    normalizedHostname.startsWith("fe80:")
  ) {
    return true;
  }

  const mappedIpv4 = parseMappedIpv4(normalizedHostname);
  if (mappedIpv4 && isPrivateIpv4(mappedIpv4)) return true;

  return isPrivateIpv4(normalizedHostname.split(".").map(Number));
}

function isPrivateIpv4(octets: number[]): boolean {
  if (
    octets.length !== 4 ||
    octets.some((octet) => !Number.isInteger(octet) || octet < 0 || octet > 255)
  ) {
    return false;
  }

  return (
    octets[0] === 0 ||
    octets[0] === 10 ||
    octets[0] === 127 ||
    (octets[0] === 169 && octets[1] === 254) ||
    (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) ||
    (octets[0] === 192 && octets[1] === 168)
  );
}

function parseMappedIpv4(hostname: string): number[] | null {
  const prefix = "::ffff:";
  if (!hostname.startsWith(prefix)) return null;

  const mappedPart = hostname.slice(prefix.length);
  if (mappedPart.includes(".")) return mappedPart.split(".").map(Number);

  const groups = mappedPart.split(":");
  if (groups.length !== 2 || groups.some((group) => !/^[0-9a-f]{1,4}$/.test(group))) {
    return null;
  }

  const high = Number.parseInt(groups[0], 16);
  const low = Number.parseInt(groups[1], 16);
  return [high >> 8, high & 255, low >> 8, low & 255];
}
