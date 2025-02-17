import { useState } from 'react';
import { 
  View, FlatList, Text, StyleSheet, TouchableOpacity, Image, Modal 
} from 'react-native';
import { useCartStore } from '@/hooks/useCartStore';
import { useRouter } from 'expo-router';

export default function CartScreen() {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart } = useCartStore();
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

  const handleCheckout = () => {
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shopping Cart</Text>
      
      {cart.length === 0 ? (
        <Text style={styles.emptyText}>Your cart is empty</Text>
      ) : (
        <FlatList
          data={cart}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Image source={{ uri: item.thumbnail }} style={styles.image} />
              <View style={styles.details}>
                <Text style={styles.itemText}>{item.title}</Text>
                <Text style={styles.price}>${item.price.toFixed(2)} each</Text>
                <View style={styles.quantityContainer}>
                  <TouchableOpacity onPress={() => decreaseQuantity(item.id)} style={styles.button}>
                    <Text>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantity}>{item.quantity}</Text>
                  <TouchableOpacity onPress={() => increaseQuantity(item.id)} style={styles.button}>
                    <Text>+</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.totalItemPrice}>Total: ${(item.price * item.quantity).toFixed(2)}</Text>
              </View>
              <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      {cart.length > 0 && (
        <View style={styles.footer}>
          <Text style={styles.totalPrice}>Total: ${totalPrice}</Text>
          <TouchableOpacity style={styles.buyNowButton} onPress={handleCheckout}>
            <Text style={styles.buyNowText}>Buy Now</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Checkout Success Modal */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Image source={require('@/assets/images/success.png')} style={styles.successImage} />
            <Text style={styles.successText}>Payment Successful!</Text>
            <Text style={styles.totalBillText}>Total Bill: ${totalPrice}</Text>
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => { 
                setModalVisible(false);
                clearCart(); // Clears the cart after checkout
              }}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  emptyText: { fontSize: 16, color: '#888', marginTop: 20, textAlign: 'center' },
  item: { flexDirection: 'row', padding: 12, borderBottomWidth: 1, alignItems: 'center' },
  image: { width: 60, height: 60, marginRight: 12 },
  details: { flex: 1 },
  itemText: { fontSize: 16, fontWeight: 'bold' },
  price: { fontSize: 14, color: '#666' },
  quantityContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  button: { padding: 5, backgroundColor: '#ddd', borderRadius: 4, marginHorizontal: 5 },
  quantity: { fontSize: 16, fontWeight: 'bold' },
  totalItemPrice: { fontSize: 14, fontWeight: 'bold', marginTop: 5 },
  removeText: { color: 'red', marginTop: 10 },
  footer: { marginTop: 20, padding: 10, borderTopWidth: 1, alignItems: 'center' },
  totalPrice: { fontSize: 18, fontWeight: 'bold' },
  buyNowButton: { backgroundColor: '#ff6600', padding: 12, marginTop: 10, borderRadius: 8, alignItems: 'center', width: '100%' },
  buyNowText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  // Modal Styles
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { width: 300, padding: 20, backgroundColor: '#fff', borderRadius: 10, alignItems: 'center' },
  successImage: { width: 100, height: 100, marginBottom: 20 },
  successText: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  totalBillText: { fontSize: 16, color: '#333', marginBottom: 20 },
  closeButton: { backgroundColor: '#ff6600', padding: 10, borderRadius: 5 },
  closeButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

