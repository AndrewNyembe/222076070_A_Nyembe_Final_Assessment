import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export default function HotelCard({ hotel, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: hotel.image }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{hotel.name}</Text>
        <Text style={styles.location}>{hotel.location}</Text>
        <Text style={styles.details}>
          ⭐ {hotel.rating} | R{hotel.price} / night
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: { width: '100%', height: 200 },
  infoContainer: { padding: 10 },
  name: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  location: { color: '#555', marginBottom: 4 },
  details: { fontSize: 14, color: '#007AFF', fontWeight: '600' },
});
