import { Image, StyleSheet, FlatList, ActivityIndicator, Dimensions, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import PromoBanner from '../../components/ui/PromoBanner';
import CustomCarousel from '../../components/ui/CustomCarousel';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter(); // Initialize router

  const [products, setProducts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetch('https://dummyjson.com/products')
      .then(response => response.json())
      .then(data => setProducts(data.products.slice(0, 20))) //limit the dummy products count from here
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setModalVisible(true);
    }, 5000);//promotional modal timer

    return () => clearTimeout(timer);
  }, []);

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => router.push(`/product/${item.id}`)} //navigate to product details
    >
      <Image source={{ uri: item.thumbnail }} style={styles.productImage} />
      <ThemedText type="subtitle">{item.title}</ThemedText>
      <ThemedText>${item.price}</ThemedText>
      <ThemedText numberOfLines={2}>{item.description}</ThemedText>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      
      <ThemedView>
      <CustomCarousel />
      </ThemedView>  
      <ThemedView style={styles.container}>
        <ThemedText style={styles.header} type="subtitle">Beauty Products</ThemedText>
        {products.length === 0 ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderProduct}
        contentContainerStyle={styles.listContainer}
          />
        )}
      </ThemedView>
      <PromoBanner modalVisible={modalVisible} setModalVisible={setModalVisible} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    backgroundColor: '#fff',
  },
  listContainer: {
    color: '#000',
    padding: 16,
  },
  header: {
    textAlign: 'center',
    marginBottom: 8,
  },
  productCard: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 10,
  },
});
