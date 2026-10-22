export const CART_STORAGE_KEY = 'loja-xukuru-cart';
export const MAX_CART_QUANTITY = 10;

function storageFor(override) {
  return override === undefined ? globalThis.localStorage : override;
}

export function normalizeCart(entries, products) {
  if (!Array.isArray(entries)) return [];
  const productIds = products ? new Set(products.map((product) => product.id)) : null;
  const quantities = new Map();

  for (const entry of entries) {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) continue;
    if (typeof entry.id !== 'string' || !/^[a-z0-9-]{1,80}$/i.test(entry.id)) continue;
    if (!Number.isInteger(entry.quantidade) || entry.quantidade < 1) continue;
    if (productIds && !productIds.has(entry.id)) continue;
    quantities.set(
      entry.id,
      Math.min(MAX_CART_QUANTITY, (quantities.get(entry.id) || 0) + entry.quantidade),
    );
  }

  return [...quantities].map(([id, quantidade]) => ({ id, quantidade }));
}

export function getCartCount(cart) {
  return normalizeCart(cart).reduce((total, item) => total + item.quantidade, 0);
}

export function readCart(storageOverride, products) {
  const storage = storageFor(storageOverride);
  const raw = storage.getItem(CART_STORAGE_KEY);
  if (!raw) return [];

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    storage.removeItem(CART_STORAGE_KEY);
    return [];
  }

  const cart = normalizeCart(parsed, products);
  const normalizedJson = JSON.stringify(cart);
  if (raw !== normalizedJson) storage.setItem(CART_STORAGE_KEY, normalizedJson);
  return cart;
}

function notifyCartUpdated(cart) {
  if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
    window.dispatchEvent(new CustomEvent('cart:updated', { detail: cart }));
  }
}

export function writeCart(entries, storageOverride, products) {
  const cart = normalizeCart(entries, products);
  storageFor(storageOverride).setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  notifyCartUpdated(cart);
  return cart;
}

function validRequestedQuantity(quantity) {
  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new RangeError('A quantidade deve ser um número inteiro maior que zero.');
  }
  return Math.min(quantity, MAX_CART_QUANTITY);
}

export function addToCart(id, quantity, products, storageOverride) {
  const productExists = products.some((product) => product.id === id);
  if (!productExists) throw new TypeError('Este item não está no catálogo demonstrativo.');
  const requested = validRequestedQuantity(quantity);
  const cart = readCart(storageOverride, products);
  const current = cart.find((item) => item.id === id)?.quantidade || 0;
  const next = cart.filter((item) => item.id !== id);
  next.push({ id, quantidade: Math.min(MAX_CART_QUANTITY, current + requested) });
  return writeCart(next, storageOverride, products);
}

export function setCartQuantity(id, quantity, products, storageOverride) {
  const requested = validRequestedQuantity(quantity);
  const cart = readCart(storageOverride, products).map((item) =>
    item.id === id ? { id, quantidade: requested } : item,
  );
  return writeCart(cart, storageOverride, products);
}

export function removeFromCart(id, products, storageOverride) {
  const cart = readCart(storageOverride, products).filter((item) => item.id !== id);
  return writeCart(cart, storageOverride, products);
}

export function clearCart(storageOverride) {
  return writeCart([], storageOverride);
}
