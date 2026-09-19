import React, { useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { radius } from '../theme/spacing';
import ItemPhoto from './ItemPhoto';


export default function PhotoGallery({ item, ratio = 0.8 }) {
  const [index, setIndex] = useState(0);
  const photos = item.photos || [];
  return (
    <View>
      <View style={styles.main}>
        <ItemPhoto item={item} uri={photos[index]} style={{ width: '100%', aspectRatio: 1 / ratio }} iconSize={72} />
      </View>
      {photos.length > 1 ? (
        <View style={styles.thumbs}>
          {photos.map((uri, i) => (
            <Pressable key={uri} onPress={() => setIndex(i)} accessibilityRole="button" accessibilityLabel={`Ver foto ${i + 1}`} accessibilityState={{ selected: i === index }} style={[styles.thumb, i === index && { borderColor: colors.moss }]}>
              <ItemPhoto item={item} uri={uri} style={{ width: '100%', height: '100%' }} iconSize={20} />
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  main: { borderRadius: radius.md, overflow: 'hidden', borderWidth: 1, borderColor: colors.line, backgroundColor: colors.paper2 },
  thumbs: { flexDirection: 'row', gap: 12, marginTop: 12 },
  thumb: { width: 64, height: 64, borderRadius: 10, overflow: 'hidden', borderWidth: 2, borderColor: 'transparent' },
});
