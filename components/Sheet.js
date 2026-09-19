import React from 'react';
import { Modal, View, Text, Pressable, KeyboardAvoidingView, Platform, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { radius, spacing } from '../theme/spacing';
import useBreakpoint from '../hooks/useBreakpoint';


export default function Sheet({ visible, onClose, title, children, maxWidth = 460 }) {
  const { isPhone, width, height } = useBreakpoint();
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType={isPhone ? 'slide' : 'fade'} onRequestClose={onClose} statusBarTranslucent>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <View style={[styles.overlay, isPhone ? styles.bottom : styles.center]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Fechar" accessibilityRole="button" />
          <View
            accessibilityViewIsModal
            style={[
              styles.panel,
              isPhone
                ? { width: '100%', maxWidth: 560, alignSelf: 'center', borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, paddingBottom: insets.bottom + spacing.lg }
                : { width: Math.min(maxWidth, width - 48), borderRadius: radius.lg, paddingBottom: spacing.lg },
              { maxHeight: height * 0.9 },
            ]}
          >
            {isPhone ? <View style={styles.grab} /> : null}
            <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} bounces={false}>
              {title ? <Text style={styles.title} accessibilityRole="header">{title}</Text> : null}
              {children}
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  overlay: { flex: 1, backgroundColor: colors.overlay },
  bottom: { justifyContent: 'flex-end' },
  center: { justifyContent: 'center', alignItems: 'center' },
  panel: { backgroundColor: colors.paper, paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
  grab: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: colors.line, marginBottom: spacing.md, marginTop: -8 },
  title: { fontFamily: fonts.displayBold, fontSize: 24, color: colors.ink, marginBottom: spacing.sm, letterSpacing: -0.3 },
});
