import React from 'react';
import { View, Text, Image, Pressable, Platform, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { radius } from '../theme/spacing';
import Screen from '../components/Page';
import TagCard from '../components/TagCard';
import StampBadge from '../components/StampBadge';
import useBreakpoint from '../hooks/useBreakpoint';
import { useApp } from '../context/AppContext';
import { useDialog } from '../context/DialogContext';
import { pickFromGallery } from '../utils/media';

function Row({ icon, label, onPress, danger, last }) {
  return (
    <Pressable onPress={onPress} style={({ hovered }) => [styles.row, last && { borderBottomWidth: 0 }, hovered && { backgroundColor: colors.paper2 }]} accessibilityRole="button" accessibilityLabel={label}>
      <Feather name={icon} size={20} color={danger ? colors.clay : colors.moss} />
      <Text style={[styles.rowText, danger && { color: colors.clay }]}>{label}</Text>
      {!danger ? <Feather name="chevron-right" size={18} color={colors.inkSoft} /> : null}
    </Pressable>
  );
}

function Stat({ n, label }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statN}>{n}</Text>
      <Text style={styles.statL}>{label}</Text>
    </View>
  );
}

export default function ProfileScreen({ navigation }) {
  const { isPhone } = useBreakpoint();
  const { user, myItems, favorites, requests, updateUser, logout } = useApp();
  const { choose, confirm } = useDialog();

  if (!user) return null; // evita erro durante o logout

  const changeAvatar = async () => {
    const options = [
      { value: 'camera', label: 'Tirar foto', icon: 'camera' },
      { value: 'gallery', label: Platform.OS === 'web' ? 'Escolher arquivo' : 'Escolher da galeria', icon: 'image' },
    ];
    if (user.avatar) options.push({ value: 'remove', label: 'Remover foto', icon: 'trash-2', danger: true });
    const choice = await choose({ title: 'Foto de perfil', options });
    if (choice === 'camera') navigation.navigate('Camera', { target: 'avatar' });
    if (choice === 'gallery') {
      const [uri] = await pickFromGallery({ limit: 1, square: true });
      if (uri) updateUser({ avatar: uri });
    }
    if (choice === 'remove') updateUser({ avatar: null });
  };

  const confirmLogout = async () => {
    const ok = await confirm({ title: 'Sair da conta?', message: 'Seus anúncios e favoritos continuam salvos neste aparelho.', confirmLabel: 'Sair', danger: true });
    if (ok) logout();
  };

  const card = (
    <TagCard style={styles.card}>
      <View style={{ position: 'absolute', top: 14, right: 14 }}><StampBadge size={52} label="R" rotation="-6deg" /></View>
      <Pressable onPress={changeAvatar} accessibilityRole="button" accessibilityLabel="Alterar foto de perfil">
        {user.avatar ? (
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, { backgroundColor: colors.moss, alignItems: 'center', justifyContent: 'center' }]}>
            <Text style={styles.avatarLetter}>{user.name.charAt(0).toUpperCase()}</Text>
          </View>
        )}
        <View style={styles.camBadge}><Feather name="camera" size={15} color={colors.white} /></View>
      </Pressable>
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.email}>{user.email}</Text>
    </TagCard>
  );

  const stats = (
    <View style={styles.stats}>
      <Stat n={myItems.length} label="ANÚNCIOS" />
      <Stat n={favorites.length} label="FAVORITOS" />
      <Stat n={requests.length} label="CONVERSAS" />
    </View>
  );

  const menu = (
    <View style={styles.menu}>
      <Row icon="package" label="Meus anúncios" onPress={() => navigation.navigate('MyItems')} />
      <Row icon="settings" label="Configurações" onPress={() => navigation.navigate('Settings')} />
      <Row icon="info" label="Sobre o ReUse" onPress={() => navigation.navigate('About')} />
      <Row icon="log-out" label="Sair da conta" danger last onPress={confirmLogout} />
    </View>
  );

  return (
    <Screen title="Perfil" max="content">
      {isPhone ? (
        <View style={{ gap: 20 }}>
          {card}
          {stats}
          {menu}
        </View>
      ) : (
        <View style={styles.cols}>
          <View style={{ flex: 1, gap: 20 }}>{card}{stats}</View>
          <View style={{ flex: 1.2 }}>{menu}</View>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  cols: { flexDirection: 'row', gap: 40, alignItems: 'flex-start' },
  card: { alignItems: 'center', paddingVertical: 32 },
  avatar: { width: 104, height: 104, borderRadius: 52, borderWidth: 3, borderColor: colors.paper },
  avatarLetter: { fontFamily: fonts.displayBold, fontSize: 42, color: colors.white },
  camBadge: { position: 'absolute', right: -2, bottom: 0, width: 34, height: 34, borderRadius: 17, backgroundColor: colors.moss, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.paper },
  name: { fontFamily: fonts.displayBold, fontSize: 26, color: colors.ink, marginTop: 18 },
  email: { fontFamily: fonts.mono, fontSize: 12, color: colors.inkSoft, marginTop: 6 },
  stats: { flexDirection: 'row', gap: 12 },
  stat: { flex: 1, backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, paddingVertical: 18, alignItems: 'center' },
  statN: { fontFamily: fonts.displayBold, fontSize: 28, color: colors.moss },
  statL: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkSoft, letterSpacing: 1, marginTop: 4 },
  menu: { backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 16, minHeight: 62, paddingHorizontal: 20, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
  rowText: { flex: 1, fontFamily: fonts.bodyMedium, fontSize: 15, color: colors.ink },
});
