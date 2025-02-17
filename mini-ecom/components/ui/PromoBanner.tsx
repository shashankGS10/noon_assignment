import React from 'react';
import { View, Image, Modal, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { ThemedText } from '@/components/ThemedText';


const { width } = Dimensions.get('window');

interface PromoBannerProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
}

export default function PromoBanner({ modalVisible, setModalVisible }: PromoBannerProps) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
            <ThemedText type="defaultSemiBold">X</ThemedText>
          </TouchableOpacity>
          <Image
            source={require('@/assets/images/banner_sale.png')}
            style={styles.bannerImage}
          />
          <ThemedText>Check out our latest deals now.</ThemedText>
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1000,  // Ensures it appears on top
    },
    modalContent: {
      width: width - 40,
      backgroundColor: '#fff',
      borderRadius: 10,
      alignItems: 'center',
      padding: 20,
      zIndex: 1001, // Ensures content inside modal is above everything
    },
    bannerImage: {
      width: '100%',
      height: 300,
      resizeMode: 'contain',
    },
    closeButton: {
      position: 'absolute',
      top: 10,
      right: 10,
      padding: 10,
      zIndex: 1002,
    },
  });
  
  