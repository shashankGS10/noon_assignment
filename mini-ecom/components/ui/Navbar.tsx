import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useCartStore } from '@/hooks/useCartStore';
import { useRouter } from 'expo-router';

export default function Navbar() {
  const router = useRouter();
  const { cart } = useCartStore();
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <View style={styles.navbar}>
      <Image source={require('@/assets/images/logo.png')} style={styles.logo} />

      {/* Cart Icon */}
      <TouchableOpacity onPress={() => router.push('/cart')} style={styles.cartContainer}>
        <Image source={require('@/assets/images/cart.png')} style={styles.cartIcon} />
        {cartCount > 0 && (
          <View style={styles.cartBadge}>
            <Text style={styles.cartCount}>{cartCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#f2f2f2', marginTop: 24 },
  logo: { width: 100, height: 50, resizeMode: 'contain' },
  cartContainer: { position: 'relative', padding: 8 },
  cartIcon: { width: 30, height: 30 },
  cartBadge: { position: 'absolute', top: -5, right: -5, backgroundColor: 'red', borderRadius: 12, width: 24, height: 24, justifyContent: 'center', alignItems: 'center' },
  cartCount: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
});
