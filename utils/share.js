import { Platform, Share } from 'react-native';

// Compartilhar funciona no celular (folha nativa) e no navegador (Web Share ou copiar para a area de transferencia)
export async function shareText(message, toast) {
  try {
    if (Platform.OS === 'web') {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({ text: message });
        return;
      }
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(message);
        toast && toast('Texto copiado para a area de transferencia');
        return;
      }
    } else {
      await Share.share({ message });
    }
  } catch (e) {}
}
