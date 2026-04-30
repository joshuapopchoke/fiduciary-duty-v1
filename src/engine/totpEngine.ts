const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

function normalizeBase32(input: string) {
  return input.toUpperCase().replace(/=+$/g, "").replace(/[^A-Z2-7]/g, "");
}

export function generateBase32Secret(length = 32) {
  const buffer = new Uint8Array(length);
  crypto.getRandomValues(buffer);
  let secret = "";

  for (let index = 0; index < length; index += 1) {
    secret += BASE32_ALPHABET[buffer[index] % BASE32_ALPHABET.length];
  }

  return secret;
}

export function decodeBase32(input: string) {
  const normalized = normalizeBase32(input);
  let bits = 0;
  let value = 0;
  const bytes: number[] = [];

  for (const char of normalized) {
    const index = BASE32_ALPHABET.indexOf(char);
    if (index < 0) {
      continue;
    }

    value = (value << 5) | index;
    bits += 5;
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }

  return new Uint8Array(bytes);
}

function counterBytes(counter: number) {
  const bytes = new Uint8Array(8);
  let value = counter;
  for (let index = 7; index >= 0; index -= 1) {
    bytes[index] = value & 0xff;
    value = Math.floor(value / 256);
  }
  return bytes;
}

async function hmacSha1(secret: Uint8Array, data: Uint8Array) {
  const secretBytes = Uint8Array.from(secret);
  const dataBytes = Uint8Array.from(data);
  const key = await crypto.subtle.importKey("raw", secretBytes, { name: "HMAC", hash: "SHA-1" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, dataBytes);
  return new Uint8Array(signature);
}

export async function generateTotp(secretBase32: string, timestamp = Date.now()) {
  const secret = decodeBase32(secretBase32);
  const counter = Math.floor(timestamp / 30000);
  const hmac = await hmacSha1(secret, counterBytes(counter));
  const offset = hmac[hmac.length - 1] & 0x0f;
  const binary = ((hmac[offset] & 0x7f) << 24)
    | ((hmac[offset + 1] & 0xff) << 16)
    | ((hmac[offset + 2] & 0xff) << 8)
    | (hmac[offset + 3] & 0xff);

  const code = (binary % 1000000).toString().padStart(6, "0");
  return code;
}

export async function verifyTotp(secretBase32: string, token: string, timestamp = Date.now()) {
  const sanitizedToken = token.replace(/\s+/g, "");
  if (!/^\d{6}$/.test(sanitizedToken)) {
    return false;
  }

  const windows = [-1, 0, 1];
  for (const windowOffset of windows) {
    const code = await generateTotp(secretBase32, timestamp + windowOffset * 30000);
    if (code === sanitizedToken) {
      return true;
    }
  }

  return false;
}

export function buildOtpAuthUri(secretBase32: string, label: string, issuer: string) {
  const encodedLabel = encodeURIComponent(`${issuer}:${label}`);
  const encodedIssuer = encodeURIComponent(issuer);
  return `otpauth://totp/${encodedLabel}?secret=${secretBase32}&issuer=${encodedIssuer}&algorithm=SHA1&digits=6&period=30`;
}

export function buildQrImageUrl(payload: string) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(payload)}`;
}
