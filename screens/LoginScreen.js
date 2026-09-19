import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { radius } from '../theme/spacing';
import AuthLayout from '../components/AuthLayout';
import Input from '../components/Input';
import PrimaryButton from '../components/PrimaryButton';
import { useApp } from '../context/AppContext';

export default function LoginScreen({ navigation }) {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    const e = {};
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) e.email = 'Digite um e-mail válido, como nome@email.com.';
    if (password.length < 6) e.password = 'A senha tem pelo menos 6 caracteres.';
    setErrors(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 450));
    const res = await login(email, password);
    setLoading(false);
    if (!res.ok) setErrors({ form: res.error });
  };

  return (
    <AuthLayout title="Que bom te ver de novo." subtitle="Entre para continuar dando segunda vida aos objetos.">
      {errors.form ? (
        <View style={styles.formError} accessibilityRole="alert">
          <Feather name="alert-circle" size={16} color={colors.clay} />
          <Text style={styles.formErrorText}>{errors.form}</Text>
        </View>
      ) : null}

      <Input label="E-mail" icon="mail" placeholder="nome@email.com" keyboardType="email-address" autoCapitalize="none" autoComplete="email" textContentType="emailAddress" returnKeyType="next" value={email} onChangeText={setEmail} error={errors.email} />
      <Input label="Senha" icon="lock" placeholder="Sua senha" secureTextEntry autoCapitalize="none" textContentType="password" returnKeyType="done" onSubmitEditing={submit} value={password} onChangeText={setPassword} error={errors.password} />

      <PrimaryButton label="Entrar" onPress={submit} loading={loading} style={{ marginTop: 4 }} />
      <PrimaryButton label="Criar conta" variant="secondary" onPress={() => navigation.navigate('Register')} style={{ marginTop: 12 }} />

      <Pressable onPress={() => { setEmail('demo@reuse.app'); setPassword('123456'); setErrors({}); }} style={styles.demo} accessibilityRole="button">
        <Feather name="zap" size={14} color={colors.moss} />
        <Text style={styles.demoText}>Só quer dar uma olhada? Use a conta de teste</Text>
      </Pressable>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  formError: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.dangerBg, borderRadius: radius.sm, padding: 14, marginBottom: 20 },
  formErrorText: { flex: 1, fontFamily: fonts.bodyMedium, fontSize: 13, lineHeight: 19, color: colors.clay },
  demo: { minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 20 },
  demoText: { fontFamily: fonts.mono, fontSize: 12, color: colors.moss, textDecorationLine: 'underline' },
});
