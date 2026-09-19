import AsyncStorage from '@react-native-async-storage/async-storage';

export const KEYS = {
  onboardingSeen: '@reuse:onboarding_seen',
  session: '@reuse:session',
  users: '@reuse:users',
  myItems: '@reuse:my_items',
  favorites: '@reuse:favorites',
  requests: '@reuse:requests',
  draft: '@reuse:draft',
  settings: '@reuse:settings',
};

export async function load(key, fallback) {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw != null ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

export async function save(key, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // falha silenciosa: o app segue funcionando em memoria
  }
}

export async function remove(key) {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {}
}

export async function clearAll() {
  try {
    await AsyncStorage.clear();
  } catch (e) {}
}
