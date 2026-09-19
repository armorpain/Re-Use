import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Platform, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { radius } from '../theme/spacing';


export default function Input({ label, icon, prefix, hint, error, secureTextEntry, multiline, style, ...props }) {
  const [focus, setFocus] = useState(false);
  const [hidden, setHidden] = useState(!!secureTextEntry);
  return (
    <View style={[styles.wrap, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.field, focus && { borderColor: colors.moss }, !!error && { borderColor: colors.clay }, multiline && { alignItems: 'flex-start' }]}>
        {icon ? <Feather name={icon} size={18} color={colors.inkSoft} style={[styles.icon, multiline && { marginTop: 17 }]} /> : null}
        {prefix ? <Text style={styles.prefix}>{prefix}</Text> : null}
        <TextInput
          {...props}
          multiline={multiline}
          secureTextEntry={hidden}
          onFocus={(e) => { setFocus(true); props.onFocus && props.onFocus(e); }}
          onBlur={(e) => { setFocus(false); props.onBlur && props.onBlur(e); }}
          placeholderTextColor={colors.placeholder}
          accessibilityLabel={label || props.placeholder}
          style={[styles.input, multiline && { minHeight: 104, textAlignVertical: 'top', paddingTop: 15 }, Platform_outline]}
        />
        {secureTextEntry ? (
          <Pressable onPress={() => setHidden((h) => !h)} hitSlop={12} accessibilityRole="button" accessibilityLabel={hidden ? 'Mostrar senha' : 'Ocultar senha'}>
            <Feather name={hidden ? 'eye' : 'eye-off'} size={19} color={colors.inkSoft} />
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <View style={styles.msgRow}><Feather name="alert-circle" size={13} color={colors.clay} /><Text style={styles.error}>{error}</Text></View>
      ) : hint ? (
        <Text style={styles.hint}>{hint}</Text>
      ) : null}
    </View>
  );
}

// remove o contorno azul padrão do navegador (o foco já é indicado pela borda)
const Platform_outline = Platform.OS === 'web' ? { outlineStyle: 'none' } : null;

const styles = StyleSheet.create({
  wrap: { marginBottom: 20 },
  label: { fontFamily: fonts.bodySemiBold, fontSize: 13, color: colors.ink, marginBottom: 8 },
  field: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.paper, borderWidth: 1.5, borderColor: colors.line, borderRadius: radius.sm, paddingHorizontal: 16, minHeight: 54 },
  icon: { marginRight: 12 },
  prefix: { fontFamily: fonts.bodySemiBold, fontSize: 16, color: colors.inkSoft, marginRight: 8 },
  input: { flex: 1, fontFamily: fonts.body, fontSize: 16, color: colors.ink, paddingVertical: 14 },
  msgRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  error: { flex: 1, fontFamily: fonts.body, fontSize: 12, lineHeight: 17, color: colors.clay },
  hint: { fontFamily: fonts.body, fontSize: 12, lineHeight: 17, color: colors.inkSoft, marginTop: 8 },
});
