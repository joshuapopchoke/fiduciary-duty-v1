import type { AuthResult, AuthSession, User } from "../types/auth";
import { generateBase32Secret } from "./totpEngine";

const AUTH_STORAGE_KEY = "fiduciary-duty-auth-users";
const DEFAULT_MANAGER_USERNAME = "Admin";
const DEFAULT_MANAGER_PASSWORD = "Admin01";
const PASSWORD_ITERATIONS = 120000;
const LOCKOUT_THRESHOLD = 5;
const LOCKOUT_WINDOW_MS = 5 * 60 * 1000;
const encoder = new TextEncoder();

type StoredUser = User & { password?: string };

function getCryptoApi(): Crypto {
  if (typeof globalThis.crypto === "undefined") {
    throw new Error("Secure crypto support is unavailable in this environment.");
  }

  return globalThis.crypto;
}

function normalizeUsername(username: string) {
  return username.trim().toLowerCase();
}

function validatePassword(password: string) {
  if (password === DEFAULT_MANAGER_PASSWORD) {
    return;
  }

  if (password.length < 8) {
    throw new Error("Passwords must be at least 8 characters.");
  }

  const hasLetter = /[A-Za-z]/.test(password);
  const hasNumber = /\d/.test(password);
  if (!hasLetter || !hasNumber) {
    throw new Error("Passwords must include at least one letter and one number.");
  }
}

function validateUsername(username: string) {
  const trimmed = username.trim();
  if (trimmed.length < 3) {
    throw new Error("Usernames must be at least 3 characters.");
  }

  if (!/^[A-Za-z0-9._-]+$/.test(trimmed)) {
    throw new Error("Usernames may contain only letters, numbers, periods, underscores, and hyphens.");
  }
}

function validateDisplayName(displayName: string) {
  const trimmed = displayName.trim();
  if (trimmed.length < 2) {
    throw new Error("Display names must be at least 2 characters.");
  }
}

function bytesToBase64(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

function randomSalt() {
  const buffer = new Uint8Array(16);
  getCryptoApi().getRandomValues(buffer);
  return bytesToBase64(buffer);
}

async function derivePasswordHash(password: string, salt: string) {
  const cryptoApi = getCryptoApi();
  const baseKey = await cryptoApi.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const derivedBits = await cryptoApi.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: encoder.encode(salt),
      iterations: PASSWORD_ITERATIONS,
      hash: "SHA-256"
    },
    baseKey,
    256
  );

  return bytesToBase64(new Uint8Array(derivedBits));
}

async function buildUserRecord(input: {
  id: string;
  username: string;
  password: string;
  displayName: string;
  role: User["role"];
  mustChangePassword: boolean;
  createdAt?: number;
}): Promise<User> {
  validateUsername(input.username);
  validateDisplayName(input.displayName);
  validatePassword(input.password);

  const passwordSalt = randomSalt();
  const passwordHash = await derivePasswordHash(input.password, passwordSalt);

  return {
    id: input.id,
    username: input.username.trim(),
    passwordHash,
    passwordSalt,
    twoFactorSecret: input.role === "manager" ? generateBase32Secret() : null,
    displayName: input.displayName.trim(),
    role: input.role,
    mustChangePassword: input.mustChangePassword,
    createdAt: input.createdAt ?? Date.now(),
    failedLoginCount: 0,
    lockoutUntil: null
  };
}

async function defaultUsers(): Promise<User[]> {
  return [
    await buildUserRecord({
      id: "manager-admin",
      username: DEFAULT_MANAGER_USERNAME,
      password: DEFAULT_MANAGER_PASSWORD,
      displayName: "Admin",
      role: "manager",
      mustChangePassword: true
    })
  ];
}

function isStoredUserArray(value: unknown): value is StoredUser[] {
  return Array.isArray(value);
}

async function migrateStoredUsers(storedUsers: StoredUser[]) {
  const migratedUsers: User[] = [];

  for (const storedUser of storedUsers) {
    if (typeof storedUser.passwordHash === "string" && typeof storedUser.passwordSalt === "string") {
      migratedUsers.push({
        ...storedUser,
        twoFactorSecret: typeof storedUser.twoFactorSecret === "string" ? storedUser.twoFactorSecret : (storedUser.role === "manager" ? generateBase32Secret() : null),
        failedLoginCount: typeof storedUser.failedLoginCount === "number" ? storedUser.failedLoginCount : 0,
        lockoutUntil: typeof storedUser.lockoutUntil === "number" ? storedUser.lockoutUntil : null
      });
      continue;
    }

    if (typeof storedUser.password === "string") {
      migratedUsers.push(await buildUserRecord({
        id: storedUser.id,
        username: storedUser.username,
        password: storedUser.password,
        displayName: storedUser.displayName,
        role: storedUser.role,
        mustChangePassword: storedUser.mustChangePassword,
        createdAt: storedUser.createdAt
      }));
    }
  }

  return migratedUsers.length > 0 ? migratedUsers : defaultUsers();
}

export async function loadMockUsers(): Promise<User[]> {
  if (typeof localStorage === "undefined") {
    return defaultUsers();
  }

  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) {
      const users = await defaultUsers();
      saveMockUsers(users);
      return users;
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!isStoredUserArray(parsed)) {
      const users = await defaultUsers();
      saveMockUsers(users);
      return users;
    }

    const users = await migrateStoredUsers(parsed);
    saveMockUsers(users);
    return users;
  } catch {
    const users = await defaultUsers();
    saveMockUsers(users);
    return users;
  }
}

export function saveMockUsers(users: User[]) {
  if (typeof localStorage === "undefined") {
    return;
  }

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(users));
}

export async function authenticateMockUser(users: User[], username: string, password: string): Promise<AuthResult> {
  const normalizedUsername = normalizeUsername(username);
  const match = users.find((user) => normalizeUsername(user.username) === normalizedUsername);
  if (!match) {
    return {
      session: null,
      users,
      error: "Invalid username or password."
    };
  }

  const now = Date.now();
  if (typeof match.lockoutUntil === "number" && match.lockoutUntil > now) {
    return {
      session: null,
      users,
      error: "This account is temporarily locked. Please try again shortly."
    };
  }

  const nextHash = await derivePasswordHash(password, match.passwordSalt);
  if (nextHash !== match.passwordHash) {
    const nextFailedCount = match.failedLoginCount + 1;
    const nextUsers = users.map((user) => user.id === match.id
      ? {
          ...user,
          failedLoginCount: nextFailedCount >= LOCKOUT_THRESHOLD ? 0 : nextFailedCount,
          lockoutUntil: nextFailedCount >= LOCKOUT_THRESHOLD ? now + LOCKOUT_WINDOW_MS : null
        }
      : user);

    return {
      session: null,
      users: nextUsers,
      error: nextFailedCount >= LOCKOUT_THRESHOLD
        ? "Too many failed attempts. This account has been locked for 5 minutes."
        : "Invalid username or password."
    };
  }

  const nextUsers = users.map((user) => user.id === match.id
    ? {
        ...user,
        failedLoginCount: 0,
        lockoutUntil: null
      }
    : user);

  return {
    session: {
      userId: match.id,
      username: match.username,
      displayName: match.displayName,
      role: match.role,
      authenticatedAt: now,
      mustChangePassword: match.mustChangePassword,
      requiresTwoFactor: match.role === "manager",
      twoFactorVerified: match.role !== "manager"
    },
    users: nextUsers,
    error: null
  };
}

export async function createEmployeeUser(users: User[], input: { displayName: string; username: string; password: string }): Promise<User[]> {
  validateDisplayName(input.displayName);
  validateUsername(input.username);
  validatePassword(input.password);

  const usernameTaken = users.some((user) => normalizeUsername(user.username) === normalizeUsername(input.username));
  if (usernameTaken) {
    throw new Error("That username is already assigned.");
  }

  return [
    ...users,
    await buildUserRecord({
      id: `employee-${Date.now()}`,
      username: input.username.trim(),
      password: input.password,
      displayName: input.displayName.trim(),
      role: "employee",
      mustChangePassword: false
    })
  ];
}

export function removeEmployeeUser(users: User[], userId: string): User[] {
  return users.filter((user) => user.role === "manager" || user.id !== userId);
}

export async function changeUserPassword(
  users: User[],
  userId: string,
  nextPassword: string,
  currentPassword?: string
): Promise<User[]> {
  validatePassword(nextPassword);

  const targetUser = users.find((user) => user.id === userId);
  if (!targetUser) {
    throw new Error("User account was not found.");
  }

  if (typeof currentPassword === "string") {
    const currentHash = await derivePasswordHash(currentPassword, targetUser.passwordSalt);
    if (currentHash !== targetUser.passwordHash) {
      throw new Error("Current password is incorrect.");
    }
  }

  const passwordSalt = randomSalt();
  const passwordHash = await derivePasswordHash(nextPassword, passwordSalt);

  return users.map((user) => user.id === userId
    ? {
        ...user,
        passwordSalt,
        passwordHash,
        mustChangePassword: false,
        failedLoginCount: 0,
        lockoutUntil: null
      }
    : user);
}
