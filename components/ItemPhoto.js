import React, { useState } from 'react';
import { View, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { categoryById } from '../data/catalog';


export default function ItemPhoto({ item, uri, style, iconSize = 34 }) {
  const [failed, setFailed] = useState(false);
  const src = uri || (item.photos && item.photos[0]);
  if (src && !failed) {
    return (
      <Image
        source={{ uri: src }}
        style={[{ backgroundColor: colors.paper2 }, style]}
        resizeMode="cover"
        onError={() => setFailed(true)}
        accessibilityLabel={`Foto de ${item.title}`}
      />
    );
  }
  const cat = categoryById(item.category);
  return (
    <View style={[{ backgroundColor: colors.paper2, alignItems: 'center', justifyContent: 'center' }, style]}>
      <Feather name={cat.icon} size={iconSize} color={colors.inkSoft} />
    </View>
  );
}
