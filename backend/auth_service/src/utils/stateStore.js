// src/utils/stateStore.js
const store = new Map();
const DEFAULT_TTL_MS = 10 * 60 * 1000; // 10 minutes

export function putState(state, payload, ttlMs = DEFAULT_TTL_MS) {
  store.set(state, { ...payload, _expiresAt: Date.now() + ttlMs });
  setTimeout(() => store.delete(state), ttlMs).unref?.();
}

export function getState(state) {
  const item = store.get(state);
  if (!item) return null;
  if (Date.now() > item._expiresAt) {
    store.delete(state);
    return null;
  }
  store.delete(state); // one-time use
  return item;
}
