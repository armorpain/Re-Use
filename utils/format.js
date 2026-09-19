// Formata centavos em reais: 4500 -> "R$ 45" | 4590 -> "R$ 45,90"
export function formatBRL(cents, { compact = true } = {}) {
  const n = Math.max(0, Math.round(cents || 0));
  const reais = String(Math.floor(n / 100)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const c = n % 100;
  if (compact && c === 0) return `R$ ${reais}`;
  return `R$ ${reais},${String(c).padStart(2, '0')}`;
}

// "35,00" (sem o simbolo), usado dentro do campo de preco
export function formatMoneyInput(cents) {
  return formatBRL(cents, { compact: false }).replace('R$ ', '');
}

export function discountPct(priceCents, originalCents) {
  if (!originalCents || originalCents <= priceCents) return 0;
  return Math.round((1 - priceCents / originalCents) * 100);
}

export const normalize = (t) =>
  (t || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

export function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

export function formatDayOrTime(iso) {
  const d = new Date(iso);
  return d.toDateString() === new Date().toDateString()
    ? formatTime(iso)
    : d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}
