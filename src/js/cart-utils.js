export function formatCep(value) {
  const digits = String(value ?? '').replace(/\D/g, '').slice(0, 8);
  return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
}

export function hasValidCep(value) {
  return /^\d{8}$/.test(String(value ?? '').replace(/\D/g, ''));
}

export function calculateCartTotals(cart, products) {
  const byId = new Map(products.map((product) => [product.id, product]));
  return cart.reduce(
    (totals, item) => {
      const product = byId.get(item.id);
      if (!product) return totals;
      totals.quantity += item.quantidade;
      totals.subtotal += product.price * item.quantidade;
      return totals;
    },
    { quantity: 0, subtotal: 0 },
  );
}
