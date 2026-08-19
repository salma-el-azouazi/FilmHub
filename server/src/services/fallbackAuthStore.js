import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storePath = path.resolve(__dirname, "../../fallback-data/auth.json");

function emptyStore() {
  return { users: [], resets: [] };
}

export function isDatabaseUnavailable(error) {
  const message = String(error?.message || "");
  return [
    "ER_ACCESS_DENIED_ERROR",
    "ECONNREFUSED",
    "PROTOCOL_CONNECTION_LOST",
    "ENOTFOUND",
    "Access denied for user",
    "connect ECONNREFUSED"
  ].some((token) => error?.code === token || message.includes(token));
}

async function readStore() {
  try {
    const raw = await fs.readFile(storePath, "utf8");
    return { ...emptyStore(), ...JSON.parse(raw) };
  } catch {
    return emptyStore();
  }
}

async function writeStore(store) {
  await fs.mkdir(path.dirname(storePath), { recursive: true });
  await fs.writeFile(storePath, JSON.stringify(store, null, 2), "utf8");
}

function normalizeEmail(email = "") {
  return String(email).trim().toLowerCase();
}

export async function findFallbackUserByEmail(email) {
  const store = await readStore();
  return store.users.find((user) => user.email.toLowerCase() === normalizeEmail(email)) || null;
}

export async function findFallbackUserById(id) {
  const store = await readStore();
  return store.users.find((user) => Number(user.id) === Number(id)) || null;
}

export async function createFallbackUser({ name, email, password }) {
  const store = await readStore();
  const normalized = normalizeEmail(email);
  if (store.users.some((user) => user.email.toLowerCase() === normalized)) return null;

  const maxId = store.users.reduce((max, user) => Math.max(max, Number(user.id) || 0), 100000);
  const user = {
    id: maxId + 1,
    name,
    email: normalized,
    password,
    role: "user",
    avatar: "",
    bio: "Fallback account stored while MySQL is unavailable.",
    status: "active",
    created_at: new Date().toISOString()
  };
  store.users.push(user);
  await writeStore(store);
  return user;
}

export async function updateFallbackPassword(userId, password) {
  const store = await readStore();
  let updated = null;
  store.users = store.users.map((user) => {
    if (Number(user.id) !== Number(userId)) return user;
    updated = { ...user, password, updated_at: new Date().toISOString() };
    return updated;
  });
  await writeStore(store);
  return updated;
}

export async function createFallbackReset({ userId, email, tokenHash, expiresAt }) {
  const store = await readStore();
  const reset = {
    id: Date.now(),
    userId,
    email: normalizeEmail(email),
    tokenHash,
    expiresAt,
    usedAt: null,
    createdAt: new Date().toISOString()
  };
  store.resets.push(reset);
  await writeStore(store);
  return reset;
}

export async function findFallbackReset(tokenHash) {
  const store = await readStore();
  const reset = store.resets
    .filter((item) => item.tokenHash === tokenHash && !item.usedAt && new Date(item.expiresAt).getTime() > Date.now())
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))[0];
  if (!reset) return null;
  const user = store.users.find((item) => Number(item.id) === Number(reset.userId));
  return user ? { ...reset, user } : null;
}

export async function markFallbackResetUsed(resetId) {
  const store = await readStore();
  store.resets = store.resets.map((reset) => (
    Number(reset.id) === Number(resetId) ? { ...reset, usedAt: new Date().toISOString() } : reset
  ));
  await writeStore(store);
}
