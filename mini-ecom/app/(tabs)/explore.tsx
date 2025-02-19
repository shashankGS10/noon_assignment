import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const Explore = () => {
    const router = useRouter();
    
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mini Game Hub</Text>
            <TouchableOpacity style={styles.card} onPress={() => router.push('/game/GameScreen')}>
                <Text style={styles.cardText}>Play Arrow Log Hit</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    title: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    card: {
        width: width * 0.8,
        padding: 20,
        backgroundColor: '#1e90ff',
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#fff',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
        elevation: 5,
    },
    cardText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default Explore;
