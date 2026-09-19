import { normalize } from './format';

const sortKey = (i) => (i.mode === 'doar' ? 0 : i.mode === 'vender' ? i.priceCents || 0 : Number.MAX_SAFE_INTEGER);

export function applyFilters(items, f) {
  const q = normalize(f.query.trim());
  const out = items.filter((i) => {
    if (i.status === 'concluido') return false;
    if (f.mode !== 'todos' && i.mode !== f.mode) return false;
    if (f.cond !== 'todos' && i.condition !== f.cond) return false;
    if (f.cat !== 'todas' && i.category !== f.cat) return false;
    if (f.mode === 'vender' && f.maxPrice && (i.priceCents || 0) > f.maxPrice * 100) return false;
    if (!q) return true;
    return normalize(`${i.title} ${i.description} ${i.location}`).includes(q);
  });
  if (f.sort === 'preco') out.sort((a, b) => sortKey(a) - sortKey(b));
  return out;
}
