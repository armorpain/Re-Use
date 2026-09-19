import * as ImagePicker from 'expo-image-picker';
import { compressImage } from './image';

const IMAGES = ImagePicker.MediaTypeOptions ? ImagePicker.MediaTypeOptions.Images : ['images'];

// Galeria (celular) ou seletor de arquivos (navegador). Devolve lista de URIs prontas para guardar.
export async function pickFromGallery({ limit = 1, square = false } = {}) {
  const res = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: IMAGES,
    allowsMultipleSelection: limit > 1 && !square,
    selectionLimit: limit,
    allowsEditing: square,
    aspect: square ? [1, 1] : undefined,
    quality: 0.7,
  });
  if (res.canceled) return [];
  return Promise.all(res.assets.map((a) => compressImage(a.uri)));
}
