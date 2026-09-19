import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { KEYS, load, save, remove, clearAll } from '../utils/storage';
import { SEED_ITEMS, DEMO_USER } from '../data/seed';
import { conditionKey } from '../data/catalog';
import { formatBRL } from '../utils/format';

const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

const DEFAULT_SETTINGS = { notifications: true, autoDraft: true, haptics: true };
export const EMPTY_DRAFT = {
  title: '', description: '', category: null, condition: null, mode: 'doar', location: '',
  photos: [], priceCents: 0, originalPriceCents: 0, negotiable: false,
};
export const DEFAULT_FILTERS = { query: '', mode: 'todos', cond: 'todos', cat: 'todas', maxPrice: null, sort: 'recentes' };

// Respostas simuladas do outro lado da conversa (sem servidor nesta fase)
const REPLIES = {
  doar: ['Oi! Ainda está disponível sim.', 'Podemos combinar a retirada no fim de semana. Fica bom para você?', 'Combinado! Te mando o endereço por aqui.'],
  trocar: ['Oi! Ainda tenho sim. O que você tem para trocar?', 'Gostei da ideia. Podemos nos encontrar no fim de semana?', 'Combinado! Te mando o endereço por aqui.'],
  vender: ['Oi! Ainda está disponível sim.', 'Podemos combinar a retirada e o pagamento na hora, em local público. Pode ser?', 'Fechado! Te mando o endereço por aqui.'],
};

const uid = (p) => `${p}${Date.now()}${Math.floor(Math.random() * 1000)}`;

export function AppProvider({ children }) {
  const [ready, setReady] = useState(false);
  const [onboardingSeen, setOnboardingSeen] = useState(false);
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([DEMO_USER]);
  const [myItems, setMyItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [requests, setRequests] = useState([]);
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [filters, setFiltersState] = useState(DEFAULT_FILTERS);
  const settingsRef = useRef(settings);
  settingsRef.current = settings;
  const activeChatRef = useRef(null);

  // ---------- Carrega tudo do Async Storage na abertura ----------
  useEffect(() => {
    (async () => {
      const [seen, session, storedUsers, items, favs, reqs, storedDraft, storedSettings] = await Promise.all([
        load(KEYS.onboardingSeen, false),
        load(KEYS.session, null),
        load(KEYS.users, [DEMO_USER]),
        load(KEYS.myItems, []),
        load(KEYS.favorites, []),
        load(KEYS.requests, []),
        load(KEYS.draft, EMPTY_DRAFT),
        load(KEYS.settings, DEFAULT_SETTINGS),
      ]);
      setOnboardingSeen(seen);
      setUser(session);
      setUsers(storedUsers);
      setMyItems(items.map((i) => ({ ...i, condition: conditionKey(i.condition), status: i.status || 'ativo', priceCents: i.priceCents || 0 })));
      setFavorites(favs);
      setRequests(reqs);
      setDraft({ ...EMPTY_DRAFT, ...storedDraft, condition: storedDraft.condition ? conditionKey(storedDraft.condition) : null });
      setSettings({ ...DEFAULT_SETTINGS, ...storedSettings });
      setReady(true);
    })();
  }, []);

  // ---------- Persistência automática ----------
  useEffect(() => { if (ready) save(KEYS.onboardingSeen, onboardingSeen); }, [ready, onboardingSeen]);
  useEffect(() => { if (ready) (user ? save(KEYS.session, user) : remove(KEYS.session)); }, [ready, user]);
  useEffect(() => { if (ready) save(KEYS.users, users); }, [ready, users]);
  useEffect(() => { if (ready) save(KEYS.myItems, myItems); }, [ready, myItems]);
  useEffect(() => { if (ready) save(KEYS.favorites, favorites); }, [ready, favorites]);
  useEffect(() => { if (ready) save(KEYS.requests, requests); }, [ready, requests]);
  useEffect(() => { if (ready) save(KEYS.settings, settings); }, [ready, settings]);
  useEffect(() => {
    if (!ready) return undefined;
    if (!settings.autoDraft) { remove(KEYS.draft); return undefined; }
    const t = setTimeout(() => save(KEYS.draft, draft), 400); // debounce
    return () => clearTimeout(t);
  }, [ready, draft, settings.autoDraft]);

  // ---------- Feedback tátil (não existe no navegador) ----------
  const haptic = useCallback((kind = 'light') => {
    if (Platform.OS === 'web' || !settingsRef.current.haptics) return;
    try {
      if (kind === 'success') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      else Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {}
  }, []);

  // ---------- Autenticação (simulada, local) ----------
  const login = useCallback(async (email, password) => {
    const found = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password);
    if (!found) return { ok: false, error: 'E-mail ou senha incorretos. Confira e tente de novo.' };
    setUser({ name: found.name, email: found.email, avatar: found.avatar || null });
    return { ok: true };
  }, [users]);

  const register = useCallback(async (name, email, password) => {
    if (users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
      return { ok: false, error: 'Já existe uma conta com esse e-mail. Que tal entrar?' };
    }
    const novo = { name: name.trim(), email: email.trim(), password, avatar: null };
    setUsers((prev) => [...prev, novo]);
    setUser({ name: novo.name, email: novo.email, avatar: null });
    return { ok: true };
  }, [users]);

  const logout = useCallback(() => setUser(null), []);

  const updateUser = useCallback((patch) => {
    setUser((prev) => (prev ? { ...prev, ...patch } : prev));
    setUsers((prev) => prev.map((u) => (user && u.email === user.email ? { ...u, ...patch } : u)));
  }, [user]);

  // ---------- Itens ----------
  const items = useMemo(
    () => [...myItems, ...SEED_ITEMS].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [myItems]
  );

  const addItem = useCallback((data) => {
    const item = {
      ...data,
      id: uid('m'),
      code: `RU-${Math.floor(1000 + Math.random() * 9000)}`,
      owner: user ? user.name : 'Você',
      mine: true,
      status: 'ativo',
      createdAt: new Date().toISOString(),
    };
    setMyItems((prev) => [item, ...prev]);
    return item;
  }, [user]);

  const removeItem = useCallback((id) => {
    setMyItems((prev) => prev.filter((i) => i.id !== id));
    setFavorites((prev) => prev.filter((f) => f !== id));
  }, []);

  // Marca como vendido, doado ou trocado (recebe o carimbo e sai do feed)
  const completeItem = useCallback((id) => {
    setMyItems((prev) => prev.map((i) => (i.id === id ? { ...i, status: 'concluido' } : i)));
  }, []);

  // ---------- Favoritos ----------
  const toggleFavorite = useCallback((id) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [id, ...prev]));
    haptic('light');
  }, [haptic]);

  // ---------- Filtros do feed (ficam guardados ao trocar de aba) ----------
  const setFilters = useCallback((patch) => setFiltersState((f) => ({ ...f, ...patch })), []);
  const resetFilters = useCallback(() => setFiltersState(DEFAULT_FILTERS), []);

  // ---------- Rascunho do anúncio ----------
  const updateDraft = useCallback((patch) => {
    setDraft((d) => ({ ...d, ...(typeof patch === 'function' ? patch(d) : patch) }));
  }, []);
  const clearDraft = useCallback(() => { setDraft(EMPTY_DRAFT); remove(KEYS.draft); }, []);

  // ---------- Conversas ----------
  const setActiveChat = useCallback((id) => { activeChatRef.current = id; }, []);

  const markRead = useCallback((id) => {
    setRequests((prev) => (prev.some((r) => r.id === id && r.unread) ? prev.map((r) => (r.id === id ? { ...r, unread: 0 } : r)) : prev));
  }, []);

  // A resposta do outro lado só gera "nova mensagem" se a conversa não estiver aberta
  const scheduleReply = useCallback((reqId) => {
    setTimeout(() => {
      setRequests((prev) => prev.map((r) => {
        if (r.id !== reqId) return r;
        const list = REPLIES[r.mode] || REPLIES.doar;
        const theirs = r.messages.filter((m) => m.from === 'them').length;
        if (theirs >= list.length) return r;
        const msg = { id: uid('c'), from: 'them', text: list[theirs], at: new Date().toISOString() };
        const open = activeChatRef.current === reqId;
        return {
          ...r,
          messages: [...r.messages, msg],
          status: theirs + 1 === list.length ? 'combinado' : r.status,
          updatedAt: msg.at,
          unread: open ? 0 : (r.unread || 0) + 1,
        };
      }));
    }, 1400);
  }, []);

  const sendMessage = useCallback((reqId, text) => {
    const now = new Date().toISOString();
    setRequests((prev) => prev.map((r) => (r.id === reqId
      ? { ...r, updatedAt: now, messages: [...r.messages, { id: uid('c'), from: 'me', text, at: now }] }
      : r)));
    scheduleReply(reqId);
  }, [scheduleReply]);

  const requestItem = useCallback((item, { offerCents } = {}) => {
    const first = item.owner.split(' ')[0];
    let text;
    if (item.mode === 'doar') text = `Oi, ${first}! Tenho interesse em "${item.title}". Ainda está disponível?`;
    else if (item.mode === 'trocar') text = `Oi, ${first}! Tenho interesse em trocar por "${item.title}". Podemos conversar?`;
    else if (offerCents) text = `Oi, ${first}! Vi "${item.title}" e queria fazer uma oferta de ${formatBRL(offerCents)}. Topa?`;
    else text = `Oi, ${first}! Tenho interesse em "${item.title}" por ${formatBRL(item.priceCents)}. Ainda está disponível?`;

    const existing = requests.find((r) => r.itemId === item.id);
    if (existing) {
      if (offerCents) sendMessage(existing.id, text);
      return existing.id;
    }
    const now = new Date().toISOString();
    const req = {
      id: uid('r'), itemId: item.id, itemTitle: item.title, itemCode: item.code, with: item.owner, mode: item.mode,
      priceCents: item.priceCents || 0, status: 'pendente', updatedAt: now, unread: 0,
      messages: [{ id: uid('c'), from: 'me', text, at: now }],
    };
    setRequests((prev) => [req, ...prev]);
    scheduleReply(req.id);
    return req.id;
  }, [requests, scheduleReply, sendMessage]);

  const totalUnread = useMemo(() => requests.reduce((n, r) => n + (r.unread || 0), 0), [requests]);

  // ---------- Configurações ----------
  const updateSettings = useCallback((patch) => setSettings((s) => ({ ...s, ...patch })), []);
  const completeOnboarding = useCallback(() => setOnboardingSeen(true), []);

  const resetAll = useCallback(async () => {
    await clearAll();
    setUser(null);
    setUsers([DEMO_USER]);
    setMyItems([]);
    setFavorites([]);
    setRequests([]);
    setDraft(EMPTY_DRAFT);
    setSettings(DEFAULT_SETTINGS);
    setFiltersState(DEFAULT_FILTERS);
    setOnboardingSeen(false);
  }, []);

  const value = useMemo(() => ({
    ready, onboardingSeen, completeOnboarding,
    user, login, register, logout, updateUser,
    items, myItems, addItem, removeItem, completeItem,
    favorites, toggleFavorite,
    filters, setFilters, resetFilters,
    draft, updateDraft, clearDraft,
    requests, requestItem, sendMessage, markRead, setActiveChat, totalUnread,
    settings, updateSettings, resetAll, haptic,
  }), [ready, onboardingSeen, completeOnboarding, user, login, register, logout, updateUser,
    items, myItems, addItem, removeItem, completeItem, favorites, toggleFavorite, filters, setFilters, resetFilters,
    draft, updateDraft, clearDraft, requests, requestItem, sendMessage, markRead, setActiveChat, totalUnread,
    settings, updateSettings, resetAll, haptic]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
