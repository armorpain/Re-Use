import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { radius } from '../theme/spacing';
import AuthLayout from '../components/AuthLayout';
import Input from '../components/Input';
import PrimaryButton from '../components/PrimaryButton';
import { useApp } from '../context/AppContext';
import { goBackOr } from '../navigation/ref';

export default function RegisterScreen({ navigation }) {
  const { register } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    const e = {};
    if (name.trim().length < 2) e.name = 'Como podemos te chamar?';
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) e.email = 'Digite um e-mail válido, como nome@email.com.';
    if (password.length < 6) e.password = 'Use pelo menos 6 caracteres.';
    if (confirm !== password) e.confirm = 'As senhas não são iguais.';
    setErrors(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 450));
    const res = await register(name, email, password);
    setLoading(false);
    if (!res.ok) setErrors({ form: res.error });
  };

  return (
    <AuthLayout title="Criar conta" subtitle="Leva menos de um minuto. Depois é só anunciar o primeiro item." onBack={() => goBackOr(navigation, 'Login')}>
      {errors.form ? (
        <View style={styles.formError} accessibilityRole="alert">
          <Feather name="alert-circle" size={16} color={colors.clay} />
          <Text style={styles.formErrorText}>{errors.form}</Text>
        </View>
      ) : null}
      <Input label="Nome" icon="user" placeholder="Seu nome" autoCapitalize="words" textContentType="name" returnKeyType="next" value={name} onChangeText={setName} error={errors.name} />
      <Input label="E-mail" icon="mail" placeholder="nome@email.com" keyboardType="email-address" autoCapitalize="none" textContentType="emailAddress" returnKeyType="next" value={email} onChangeText={setEmail} error={errors.email} />
      <Input label="Senha" icon="lock" placeholder="Mínimo de 6 caracteres" secureTextEntry autoCapitalize="none" textContentType="newPassword" returnKeyType="next" value={password} onChangeText={setPassword} error={errors.password} />
      <Input label="Confirmar senha" icon="check-circle" placeholder="Repita a senha" secureTextEntry autoCapitalize="none" returnKeyType="done" onSubmitEditing={submit} value={confirm} onChangeText={setConfirm} error={errors.confirm} />
      <PrimaryButton label="Criar conta" onPress={submit} loading={loading} style={{ marginTop: 4 }} />
      <PrimaryButton label="Já tenho conta" variant="secondary" onPress={() => navigation.navigate('Login')} style={{ marginTop: 12 }} />
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  formError: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.dangerBg, borderRadius: radius.sm, padding: 14, marginBottom: 20 },
  formErrorText: { flex: 1, fontFamily: fonts.bodyMedium, fontSize: 13, lineHeight: 19, color: colors.clay },
});
