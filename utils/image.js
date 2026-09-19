import { Platform } from 'react-native';

/**
 * No navegador, fotos da camera/galeria chegam como data URI grande (ou blob que some ao recarregar).
 * Reduzimos para no maximo 900px em JPEG antes de guardar, para caber no Async Storage (localStorage).
 * No celular a URI aponta para um arquivo e segue como esta.
 */
export function compressImage(uri, maxSize = 900, quality = 0.72) {
  if (Platform.OS !== 'web' || typeof document === 'undefined') return Promise.resolve(uri);
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => {
      try {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      } catch (e) {
        resolve(uri);
      }
    };
    img.onerror = () => resolve(uri);
    img.src = uri;
  });
}
