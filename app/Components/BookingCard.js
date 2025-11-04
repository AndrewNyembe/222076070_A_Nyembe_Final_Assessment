import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function BookingCard({ booking, onPress }) {
 
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return { backgroundColor: '#DCFCE7', color: '#166534' };
      case 'pending':
        return { backgroundColor: '#FEF9C3', color: '#854D0E' };
      case 'cancelled':
        return { backgroundColor: '#FEE2E2', color: '#991B1B' };
      default:
        return { backgroundColor: '#F3F4F6', color: '#374151' };
    }
  };

  const statusStyle = getStatusStyle(booking.status);

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress}
      activeOpacity={0.8}
    >
     
      <View style={styles.header}>
        <Text style={styles.hotelName} numberOfLines={1}>
          {booking.hotelName}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: statusStyle.backgroundColor }]}>
          <Text style={[styles.statusText, { color: statusStyle.color }]}>
            {booking.status || 'Confirmed'}
          </Text>
        </View>
      </View>

     
      <View style={styles.locationRow}>
        <Ionicons name="location-outline" size={14} color="#666" />
        <Text style={styles.location} numberOfLines={1}>
          {booking.location}
        </Text>
      </View>

      
      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Ionicons name="calendar-outline" size={14} color="#666" />
          <Text style={styles.detailText}>
            {booking.checkIn} - {booking.checkOut}
          </Text>
        </View>
        
        <View style={styles.detailItem}>
          <Ionicons name="moon-outline" size={14} color="#666" />
          <Text style={styles.detailText}>
            {booking.nights} {booking.nights === 1 ? 'night' : 'nights'}
          </Text>
        </View>
      </View>

      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Ionicons name="person-outline" size={14} color="#666" />
          <Text style={styles.detailText}>
            {booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}
          </Text>
        </View>
        
        <View style={styles.detailItem}>
          <Ionicons name="bed-outline" size={14} color="#666" />
          <Text style={styles.detailText}>
            {booking.rooms} {booking.rooms === 1 ? 'room' : 'rooms'}
          </Text>
        </View>
      </View>

    
      <View style={styles.footer}>
        <View>
          <Text style={styles.bookingId}>Booking #{booking.id}</Text>
          <Text style={styles.bookingDate}>{booking.bookingDate}</Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.price}>R{booking.totalPrice}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#FEF3C7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  hotelName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E3A8A',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 80,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
    flex: 1,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  bookingId: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  bookingDate: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  totalLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
});