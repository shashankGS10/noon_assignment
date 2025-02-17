import React, { Suspense, useState } from 'react';
import { View, Image, StyleSheet, Dimensions, FlatList, ActivityIndicator } from 'react-native';

const { width } = Dimensions.get('window');

interface ProductCarouselProps {
  images: string[];
}

const placeholderImage = require('@/assets/images/icon.png'); // Default fallback image

export default function ProductCarousel({ images }: ProductCarouselProps) {
  const [loading, setLoading] = useState(true);

  return (
    <Suspense fallback={<ActivityIndicator size="large" color="#ff6600" style={styles.loader} />}>
      <View style={styles.container}>
        <FlatList
          horizontal
          pagingEnabled
          data={images.length > 0 ? images : [placeholderImage]} // Ensure at least one image
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <Image
              source={typeof item === 'string' ? { uri: item } : item} // Handles local & remote images
              style={styles.image}
              onLoadEnd={() => setLoading(false)}
            />
          )}
        />
        {loading && <ActivityIndicator size="large" color="#ff6600" style={styles.loader} />}
      </View>
    </Suspense>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  image: {
    width: width,
    height: 250,
    resizeMode: 'cover',
  },
  loader: {
    position: 'absolute',
    alignSelf: 'center',
  },
});
