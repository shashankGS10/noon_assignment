import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import ProductCarousel from '@/components/ui/ProductCarousel';
import { ThemedText } from '@/components/ThemedText';
import { useCartStore } from '@/hooks/useCartStore';

const { width } = Dimensions.get('window');

export default function ProductDetails() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { cart, addToCart, increaseQuantity, decreaseQuantity } = useCartStore();
  const router = useRouter();

  useEffect(() => {
    if (!id) {
      setError('Invalid Product ID');
      setLoading(false);
      return;
    }

    fetch(`https://dummyjson.com/products/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch product details');
        }
        return response.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <ActivityIndicator size="large" color="#ff6600" style={styles.loader} />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <ThemedText style={styles.errorText}>{error}</ThemedText>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <ThemedText style={styles.errorText}>Product not found</ThemedText>
      </View>
    );
  }

  const cartItem = cart.find((item) => item.id === product.id);

  return (
    <View style={styles.container}>
      <ProductCarousel images={product.images} />
      <ThemedText style={styles.title}>{product.title}</ThemedText>
      <ThemedText style={styles.price}>${product.price.toFixed(2)}</ThemedText>
      <ThemedText style={styles.description}>{product.description}</ThemedText>

      {cartItem ? (
        <View style={styles.counterContainer}>
          <TouchableOpacity onPress={() => decreaseQuantity(product.id)} style={styles.counterButton}>
            <ThemedText style={styles.counterText}>-</ThemedText>
          </TouchableOpacity>
          <ThemedText style={styles.quantity}>{cartItem.quantity}</ThemedText>
          <TouchableOpacity onPress={() => increaseQuantity(product.id)} style={styles.counterButton}>
            <ThemedText style={styles.counterText}>+</ThemedText>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.addToCartButton} onPress={() => addToCart(product)}>
          <ThemedText style={styles.addToCartText}>Add to Cart</ThemedText>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.goToCartButton} onPress={() => router.push('/cart')}>
        <ThemedText style={styles.goToCartText}>Go to Cart</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  price: {
    fontSize: 18,
    color: '#ff6600',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#555',
  },
  addToCartButton: {
    backgroundColor: '#ff6600',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  goToCartButton: {
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  goToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  counterButton: {
    backgroundColor: '#ff6600',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  counterText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  quantity: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});