import React from 'react';
import { View, Text, Switch, Pressable, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { radius } from '../theme/spacing';
import Screen from '../components/Page';
import { useApp } from '../context/AppContext';
import { useDialog } from '../context/DialogContext';
import { goBackOr } from '../navigation/ref';

function ToggleRow({ title, text, value, onChange, last }) {
  return (
    <View style={[styles.row, last && { borderBottomWidth: 0 }]}>
      <View style={{ flex: 1, paddingRight: 16 }}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowText}>{text}</Text>
      </View>
      <Switch value={value} onValueChange={onChange} trackColor={{ false: colors.line, true: colors.moss }} thumbColor={colors.white} accessibilityLabel={title} />
    </View>
  );
}

export default function SettingsScreen({ navigation }) {
  const { settings, updateSettings, resetAll } = useApp();
  const { confirm } = useDialog();

  const onReset = async () => {
    const ok = await confirm({
      title: 'Apagar dados do aparelho?',
      message: 'Vamos remover sua conta local, anúncios, favoritos, conversas e rascunho. Não dá para desfazer.',
      confirmLabel: 'Apagar tudo',
      danger: true,
    });
    if (ok) resetAll();
  };

  return (
    <Screen title="Configurações" onBack={() => goBackOr(navigation, 'Perfil')} max="narrow">
      <Text style={styles.group}>PREFERÊNCIAS</Text>
      <View style={styles.card}>
        <ToggleRow title="Notificações" text="Avisar quando alguém responder sua conversa." value={settings.notifications} onChange={(v) => updateSettings({ notifications: v })} />
        <ToggleRow title="Salvar rascunho automaticamente" text="Guarda o anúncio em andamento se você sair da tela." value={settings.autoDraft} onChange={(v) => updateSettings({ autoDraft: v })} />
        <ToggleRow title="Vibração ao tocar" text="Resposta tátil em favoritos, fotos e confirmações (somente no celular)." value={settings.haptics} onChange={(v) => updateSettings({ haptics: v })} last />
      </View>

      <Text style={[styles.group, { marginTop: 32 }]}>DADOS NESTE APARELHO</Text>
      <View style={styles.card}>
        <Pressable onPress={onReset} style={[styles.row, { borderBottomWidth: 0 }]} accessibilityRole="button" accessibilityLabel="Apagar dados do aparelho">
          <View style={{ flex: 1 }}>
            <Text style={[styles.rowTitle, { color: colors.clay }]}>Apagar dados do aparelho</Text>
            <Text style={styles.rowText}>Remove tudo o que o ReUse guardou localmente.</Text>
          </View>
        </Pressable>
      </View>

      <Text style={styles.version}>ReUse · versão 2.0.0</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  group: { fontFamily: fonts.mono, fontSize: 11, letterSpacing: 1.5, color: colors.clay, marginBottom: 12, marginLeft: 4 },
  card: { backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', minHeight: 72, paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
  rowTitle: { fontFamily: fonts.bodySemiBold, fontSize: 15, color: colors.ink },
  rowText: { fontFamily: fonts.body, fontSize: 13, color: colors.inkSoft, marginTop: 4, lineHeight: 19 },
  version: { fontFamily: fonts.mono, fontSize: 11, color: colors.inkSoft, textAlign: 'center', marginTop: 40 },
});
