import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Sheet from '../components/Sheet';
import PrimaryButton from '../components/PrimaryButton';
import useBreakpoint from '../hooks/useBreakpoint';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { radius, spacing } from '../theme/spacing';

const DialogContext = createContext(null);
export const useDialog = () => useContext(DialogContext);

/**
 * confirm({ title, message, confirmLabel, danger })  -> Promise<boolean>
 * choose({ title, message, options: [{ value, label, icon, danger }] }) -> Promise<value | null>
 * toast(texto)
 */
export function DialogProvider({ children }) {
  const { isPhone } = useBreakpoint();
  const [dlg, setDlg] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);
  const resolver = useRef(null);
  const timer = useRef(null);

  const open = useCallback((config) => new Promise((resolve) => { resolver.current = resolve; setDlg(config); }), []);
  const finish = useCallback((value) => {
    const r = resolver.current;
    resolver.current = null;
    setDlg(null);
    if (r) r(value);
  }, []);

  const confirm = useCallback((o) => open({ kind: 'confirm', ...o }), [open]);
  const choose = useCallback((o) => open({ kind: 'choose', ...o }), [open]);
  const toast = useCallback((msg) => {
    setToastMsg(msg);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToastMsg(null), 2600);
  }, []);

  const dismiss = () => finish(dlg && dlg.kind === 'confirm' ? false : null);

  return (
    <DialogContext.Provider value={{ confirm, choose, toast }}>
      {children}
      <Sheet visible={!!dlg} onClose={dismiss} title={dlg ? dlg.title : ''}>
        {dlg && dlg.message ? <Text style={styles.message}>{dlg.message}</Text> : null}
        {dlg && dlg.kind === 'confirm' ? (
          <View style={styles.actions}>
            <PrimaryButton label={dlg.confirmLabel || 'Confirmar'} danger={dlg.danger} onPress={() => finish(true)} />
            <PrimaryButton label={dlg.cancelLabel || 'Cancelar'} variant="secondary" onPress={() => finish(false)} style={{ marginTop: spacing.sm }} />
          </View>
        ) : null}
        {dlg && dlg.kind === 'choose' ? (
          <View style={styles.actions}>
            {dlg.options.map((o) => (
              <Pressable key={o.value} onPress={() => finish(o.value)} style={({ pressed }) => [styles.option, pressed && { backgroundColor: colors.paper2 }]} accessibilityRole="button" accessibilityLabel={o.label}>
                <Feather name={o.icon || 'chevron-right'} size={20} color={o.danger ? colors.clay : colors.moss} />
                <Text style={[styles.optionText, o.danger && { color: colors.clay }]}>{o.label}</Text>
              </Pressable>
            ))}
            <PrimaryButton label="Cancelar" variant="secondary" onPress={() => finish(null)} style={{ marginTop: spacing.sm }} />
          </View>
        ) : null}
      </Sheet>

      {toastMsg ? (
        <View pointerEvents="none" style={[styles.toastWrap, { bottom: isPhone ? 96 : 32 }]}>
          <View style={styles.toast} accessibilityLiveRegion="polite">
            <Feather name="check-circle" size={16} color={colors.paper} />
            <Text style={styles.toastText}>{toastMsg}</Text>
          </View>
        </View>
      ) : null}
    </DialogContext.Provider>
  );
}

const styles = StyleSheet.create({
  message: { fontFamily: fonts.body, fontSize: 15, lineHeight: 23, color: colors.inkSoft, marginBottom: spacing.sm },
  actions: { marginTop: spacing.md },
  option: { flexDirection: 'row', alignItems: 'center', minHeight: 56, paddingHorizontal: spacing.md, borderRadius: radius.sm, gap: 14 },
  optionText: { fontFamily: fonts.bodyMedium, fontSize: 16, color: colors.ink },
  toastWrap: { position: 'absolute', left: 0, right: 0, alignItems: 'center', paddingHorizontal: spacing.md },
  toast: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.ink, paddingHorizontal: 18, paddingVertical: 12, borderRadius: radius.pill, maxWidth: 480 },
  toastText: { fontFamily: fonts.bodyMedium, fontSize: 14, color: colors.paper },
});
