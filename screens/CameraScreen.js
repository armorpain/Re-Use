import React, { useRef, useState } from 'react';
import { View, Text, Pressable, Image, Platform, StyleSheet, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import PrimaryButton from '../components/PrimaryButton';
import useBreakpoint from '../hooks/useBreakpoint';
import { useApp } from '../context/AppContext';
import { pickFromGallery } from '../utils/media';
import { compressImage } from '../utils/image';
import { goBackOr } from '../navigation/ref';
import { Linking } from 'react-native';

const MAX_PHOTOS = 3;

/**
 * Câmera do app. Serve a dois usos:
 *  target "draft"  -> fotos do anúncio (até 3), moldura retangular grande e centralizada
 *  target "avatar" -> foto de perfil, moldura circular e câmera frontal
 */
export default function CameraScreen({ navigation, route }) {
  const target = (route.params && route.params.target) || 'draft';
  const avatar = target === 'avatar';
  const insets = useSafeAreaInsets();
  const { width, height } = useBreakpoint();
  const { draft, updateDraft, updateUser, haptic } = useApp();
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef(null);
  const [facing, setFacing] = useState(avatar ? 'front' : 'back');
  const [flash, setFlash] = useState('off');
  const [preview, setPreview] = useState(null);
  const [busy, setBusy] = useState(false);

  const back = () => goBackOr(navigation, avatar ? 'Perfil' : 'Anunciar');
  const remaining = MAX_PHOTOS - draft.photos.length;

  // Moldura grande e no CENTRO da tela (ocupa cerca de 86% da largura e 56% da altura)
  const boxW = Math.min(width, 720);
  const frameW = Math.min(boxW * 0.86, 560);
  const frameH = avatar ? frameW : Math.min(height * 0.56, frameW * 1.15);

  const commit = (uris) => {
    if (avatar) updateUser({ avatar: uris[0] });
    else updateDraft((d) => ({ photos: [...d.photos, ...uris].slice(0, MAX_PHOTOS) }));
    haptic('success');
    back();
  };

  const fromGallery = async () => {
    const uris = await pickFromGallery({ limit: avatar ? 1 : Math.max(remaining, 1), square: avatar });
    if (uris.length) commit(uris);
  };

  if (!permission) return <View style={{ flex: 1, backgroundColor: '#000' }} />;

  // Permissão ainda não concedida: explica o motivo e oferece alternativa
  if (!permission.granted) {
    return (
      <View style={[styles.perm, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 }]}>
        <StatusBar style="dark" />
        <Pressable onPress={back} style={styles.closeDark} accessibilityRole="button" accessibilityLabel="Fechar"><Feather name="x" size={24} color={colors.ink} /></Pressable>
        <View style={styles.permBody}>
          <View style={styles.permIcon}><Feather name="camera" size={38} color={colors.moss} /></View>
          <Text style={styles.permTitle}>{avatar ? 'Vamos tirar sua foto' : 'Vamos fotografar o item'}</Text>
          <Text style={styles.permText}>Usamos a câmera só para {avatar ? 'a sua foto de perfil' : 'as fotos do seu anúncio'}. Nada é enviado sem você confirmar.</Text>
          <View style={{ alignSelf: 'stretch', maxWidth: 360, marginTop: 32 }}>
            {permission.canAskAgain || Platform.OS === 'web' ? (
              <PrimaryButton label="Permitir câmera" onPress={requestPermission} />
            ) : (
              <PrimaryButton label="Abrir configurações" onPress={() => Linking.openSettings()} />
            )}
            <PrimaryButton label={Platform.OS === 'web' ? 'Escolher arquivo' : 'Escolher da galeria'} variant="secondary" icon="image" onPress={fromGallery} style={{ marginTop: 12 }} />
          </View>
        </View>
      </View>
    );
  }

  const capture = async () => {
    if (!ref.current || busy) return;
    try {
      setBusy(true);
      haptic('light');
      const photo = await ref.current.takePictureAsync({ quality: 0.7 });
      setPreview(await compressImage(photo.uri));
    } catch (e) {
      // se falhar, a pessoa pode tentar de novo
    } finally {
      setBusy(false);
    }
  };

  // Pré-visualização: usar ou refazer
  if (preview) {
    return (
      <View style={styles.root}>
        <StatusBar style="light" />
        <View style={styles.column}>
          <Image source={{ uri: preview }} style={StyleSheet.absoluteFill} resizeMode="cover" accessibilityLabel="Pré-visualização da foto" />
          <View style={[styles.previewBar, { paddingBottom: insets.bottom + 20 }]}>
            <Pressable onPress={() => setPreview(null)} style={styles.previewBtn} accessibilityRole="button" accessibilityLabel="Refazer foto">
              <Feather name="rotate-ccw" size={20} color={colors.white} />
              <Text style={styles.previewBtnText}>Refazer</Text>
            </Pressable>
            <Pressable onPress={() => commit([preview])} style={[styles.previewBtn, { backgroundColor: colors.moss }]} accessibilityRole="button" accessibilityLabel="Usar esta foto">
              <Feather name="check" size={20} color={colors.white} />
              <Text style={styles.previewBtnText}>Usar foto</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <View style={styles.column}>
        <CameraView ref={ref} style={StyleSheet.absoluteFill} facing={facing} flash={flash} />

        {/* moldura centralizada na tela, independente das barras */}
        <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.frameWrap]}>
          <View style={{ width: frameW, height: frameH, borderRadius: avatar ? frameW / 2 : 28, borderWidth: 2.5, borderStyle: 'dashed', borderColor: 'rgba(248,246,236,0.92)' }} />
        </View>
        <View pointerEvents="none" style={[styles.hintWrap, { bottom: insets.bottom + 150 }]}>
          <Text style={styles.hint}>{avatar ? 'Centralize o rosto dentro do círculo' : 'Enquadre o item inteiro dentro da moldura'}</Text>
        </View>

        <View style={[styles.topBar, { paddingTop: insets.top + 12 }]}>
          <Pressable onPress={back} style={styles.round} accessibilityRole="button" accessibilityLabel="Fechar câmera"><Feather name="x" size={22} color={colors.white} /></Pressable>
          {!avatar ? <Text style={styles.counter}>{draft.photos.length}/{MAX_PHOTOS} FOTOS</Text> : <View />}
          {Platform.OS !== 'web' ? (
            <Pressable onPress={() => setFlash((f) => (f === 'off' ? 'on' : 'off'))} style={styles.round} accessibilityRole="button" accessibilityLabel={flash === 'off' ? 'Ligar flash' : 'Desligar flash'}>
              <Feather name={flash === 'off' ? 'zap-off' : 'zap'} size={20} color={flash === 'off' ? colors.white : colors.mustard} />
            </Pressable>
          ) : <View style={{ width: 48 }} />}
        </View>

        <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 24 }]}>
          <Pressable onPress={fromGallery} style={styles.round} accessibilityRole="button" accessibilityLabel="Escolher da galeria"><Feather name="image" size={22} color={colors.white} /></Pressable>
          <Pressable onPress={capture} disabled={busy} accessibilityRole="button" accessibilityLabel="Tirar foto" style={styles.shutterOuter}>
            {busy ? <ActivityIndicator color={colors.white} /> : <View style={styles.shutterInner} />}
          </Pressable>
          <Pressable onPress={() => setFacing((f) => (f === 'back' ? 'front' : 'back'))} style={styles.round} accessibilityRole="button" accessibilityLabel="Virar câmera"><Feather name="refresh-cw" size={20} color={colors.white} /></Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000', alignItems: 'center' },
  column: { flex: 1, width: '100%', maxWidth: 720, overflow: 'hidden' },
  perm: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 24 },
  closeDark: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', marginLeft: -10 },
  permBody: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  permIcon: { width: 92, height: 92, borderRadius: 46, borderWidth: 2, borderStyle: 'dashed', borderColor: colors.moss, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-6deg' }] },
  permTitle: { fontFamily: fonts.displayBold, fontSize: 28, color: colors.ink, marginTop: 28, textAlign: 'center' },
  permText: { fontFamily: fonts.body, fontSize: 15, lineHeight: 23, color: colors.inkSoft, marginTop: 12, textAlign: 'center', maxWidth: 340 },
  frameWrap: { alignItems: 'center', justifyContent: 'center' },
  hintWrap: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  hint: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.white, textAlign: 'center', paddingHorizontal: 16, paddingVertical: 8, backgroundColor: 'rgba(0,0,0,0.45)', borderRadius: 999, overflow: 'hidden' },
  topBar: { position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
  counter: { fontFamily: fonts.monoSemiBold, fontSize: 12, color: colors.white, letterSpacing: 1, backgroundColor: 'rgba(0,0,0,0.45)', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, overflow: 'hidden' },
  round: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center' },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingHorizontal: 24, paddingTop: 16 },
  shutterOuter: { width: 80, height: 80, borderRadius: 40, borderWidth: 4, borderColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  shutterInner: { width: 62, height: 62, borderRadius: 31, backgroundColor: colors.white },
  previewBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 20, backgroundColor: 'rgba(0,0,0,0.4)' },
  previewBtn: { flexDirection: 'row', alignItems: 'center', minHeight: 52, paddingHorizontal: 24, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.18)' },
  previewBtnText: { fontFamily: fonts.bodySemiBold, fontSize: 15, color: colors.white, marginLeft: 10 },
});
