import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Platform,
  StyleSheet,
  ScrollView,
  Animated,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { auth } from '../../../firebase/firebaseConfig';

export default function BookingScreen({ route, navigation }) {
  const { hotel } = route.params;
  const [checkIn, setCheckIn] = useState(new Date());
  const [checkOut, setCheckOut] = useState(new Date(new Date().setDate(new Date().getDate() + 1)));
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerType, setPickerType] = useState('checkIn');
  const fadeAnim = useState(new Animated.Value(0))[0];

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);


  const getNights = () => {
    const diff = checkOut.getTime() - checkIn.getTime();
    return diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 0;
  };


  const totalCost = getNights() * hotel.price * rooms;

  
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  
  const handleBooking = () => {
    if (!auth.currentUser) {
      Alert.alert('Login Required', 'Please sign in to book a room.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Go to Sign In', onPress: () => navigation.navigate('SignIn') },
      ]);
      return;
    }

    if (checkOut <= checkIn) {
      Alert.alert('Invalid Dates', 'Check-out must be after check-in.');
      return;
    }

    if (getNights() === 0) {
      Alert.alert('Invalid Stay', 'Minimum stay is 1 night.');
      return;
    }

    Alert.alert(
      'Confirm Booking',
      `Hotel: ${hotel.name}\nLocation: ${hotel.location}\nCheck-in: ${formatDate(checkIn)}\nCheck-out: ${formatDate(checkOut)}\nRooms: ${rooms}\nGuests: ${adults + children}\nTotal: R${totalCost}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm Booking',
          onPress: () => {
         
            Alert.alert(
              'Booking Confirmed! 🎉',
              'Your room has been booked successfully. You will receive a confirmation email shortly.',
              [{ text: 'Continue', onPress: () => navigation.navigate('Explore') }]
            );
          },
        },
      ]
    );
  };

  const onChange = (event, selectedDate) => {
    setShowPicker(Platform.OS === 'ios');
    if (selectedDate) {
      if (pickerType === 'checkIn') {
        setCheckIn(selectedDate);
        
        if (checkOut <= selectedDate) {
          const nextDay = new Date(selectedDate);
          nextDay.setDate(nextDay.getDate() + 1);
          setCheckOut(nextDay);
        }
      } else {
        setCheckOut(selectedDate);
      }
    }
  };

  const openDatePicker = (type) => {
    setPickerType(type);
    setShowPicker(true);
  };

  const Counter = ({ value, onDecrease, onIncrease, label, min = 1 }) => (
    <View style={styles.counterContainer}>
      <Text style={styles.counterLabel}>{label}</Text>
      <View style={styles.counterRow}>
        <TouchableOpacity
          style={[styles.counterButton, value <= min && styles.counterButtonDisabled]}
          onPress={onDecrease}
          disabled={value <= min}
        >
          <Ionicons name="remove" size={20} color={value <= min ? '#CCC' : '#1E3A8A'} />
        </TouchableOpacity>
        <Text style={styles.counterValue}>{value}</Text>
        <TouchableOpacity
          style={[styles.counterButton, value >= 10 && styles.counterButtonDisabled]}
          onPress={onIncrease}
          disabled={value >= 10}
        >
          <Ionicons name="add" size={20} color={value >= 10 ? '#CCC' : '#1E3A8A'} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFBED" />
      
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#1E3A8A" />
            </TouchableOpacity>
            <Text style={styles.title}>Book Your Stay</Text>
            <View style={styles.placeholder} />
          </View>

          <View style={styles.hotelCard}>
            <Text style={styles.hotelName}>{hotel.name}</Text>
            <Text style={styles.hotelLocation}>{hotel.location}</Text>
            <View style={styles.priceRow}>
              <Text style={styles.price}>R{hotel.price}</Text>
              <Text style={styles.night}>/ night</Text>
            </View>
          </View>

      
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Dates</Text>
            <View style={styles.dateRow}>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => openDatePicker('checkIn')}
              >
                <Ionicons name="calendar-outline" size={20} color="#1E3A8A" />
                <View style={styles.dateInfo}>
                  <Text style={styles.dateLabel}>Check-in</Text>
                  <Text style={styles.dateValue}>{formatDate(checkIn)}</Text>
                </View>
              </TouchableOpacity>

              <View style={styles.dateSeparator}>
                <Ionicons name="arrow-forward" size={16} color="#666" />
              </View>

              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => openDatePicker('checkOut')}
              >
                <Ionicons name="calendar-outline" size={20} color="#1E3A8A" />
                <View style={styles.dateInfo}>
                  <Text style={styles.dateLabel}>Check-out</Text>
                  <Text style={styles.dateValue}>{formatDate(checkOut)}</Text>
                </View>
              </TouchableOpacity>
            </View>

            {showPicker && (
              <DateTimePicker
                value={pickerType === 'checkIn' ? checkIn : checkOut}
                mode="date"
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                onChange={onChange}
                minimumDate={pickerType === 'checkOut' ? new Date(checkIn.getTime() + 86400000) : new Date()}
              />
            )}
          </View>

          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Guests & Rooms</Text>
            
            <Counter
              label="Rooms"
              value={rooms}
              onDecrease={() => setRooms(prev => Math.max(1, prev - 1))}
              onIncrease={() => setRooms(prev => prev + 1)}
            />

            <Counter
              label="Adults"
              value={adults}
              onDecrease={() => setAdults(prev => Math.max(1, prev - 1))}
              onIncrease={() => setAdults(prev => prev + 1)}
            />

            <Counter
              label="Children"
              value={children}
              min={0}
              onDecrease={() => setChildren(prev => Math.max(0, prev - 1))}
              onIncrease={() => setChildren(prev => prev + 1)}
            />
          </View>

      
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Price Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                R{hotel.price} × {rooms} room{rooms > 1 ? 's' : ''} × {getNights()} night{getNights() > 1 ? 's' : ''}
              </Text>
              <Text style={styles.summaryValue}>R{totalCost}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>R{totalCost}</Text>
            </View>
          </View>

          
          <TouchableOpacity 
            style={[
              styles.bookButton,
              (getNights() === 0 || totalCost === 0) && styles.bookButtonDisabled
            ]} 
            onPress={handleBooking}
            disabled={getNights() === 0 || totalCost === 0}
          >
            <Text style={styles.bookButtonText}>
              Confirm Booking • R{totalCost}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFFBED',
  },
  content: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E3A8A',
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  hotelCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#FEF3C7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  hotelName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 4,
  },
  hotelLocation: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  night: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#FEF3C7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 16,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FEF3C7',
  },
  dateInfo: {
    marginLeft: 12,
  },
  dateLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  dateValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E3A8A',
  },
  dateSeparator: {
    paddingHorizontal: 12,
  },
  counterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  counterLabel: {
    fontSize: 16,
    color: '#1E3A8A',
    fontWeight: '600',
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#1E3A8A',
  },
  counterButtonDisabled: {
    backgroundColor: '#F5F5F5',
    borderColor: '#E5E5E5',
  },
  counterValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginHorizontal: 16,
    minWidth: 30,
    textAlign: 'center',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#FEF3C7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E3A8A',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  bookButton: {
    backgroundColor: '#1E3A8A',
    padding: 18,
    borderRadius: 16,
    marginBottom: 30,
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  bookButtonDisabled: {
    backgroundColor: '#CCC',
    shadowColor: '#999',
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});