const brlFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export function formatBRL(value) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new TypeError('O valor precisa ser numérico para a formatação em reais.');
  }

  return brlFormatter.format(value);
}
