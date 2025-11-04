import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  FlatList, 
  Alert, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  StatusBar,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../../../firebase/firebaseConfig';
import { onAuthStateChanged, signOut, updateProfile } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import BookingCard from '../../Components/BookingCard';

export default function ProfileScreen() {
  const [user, setUser] = useState(auth.currentUser);
  const [name, setName] = useState(auth.currentUser?.displayName || '');
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  const [bookings, setBookings] = useState([
    {
      id: '1',
      hotelName: 'Ocean View Hotel',
      location: 'Cape Town',
      checkIn: '2025-11-10',
      checkOut: '2025-11-12',
      nights: 2,
      guests: 2,
      rooms: 1,
      totalPrice: 4400,
      status: 'confirmed',
      bookingDate: 'Booked on Oct 25, 2024'
    },
    {
      id: '2',
      hotelName: 'Mountain Lodge',
      location: 'Drakensberg',
      checkIn: '2025-12-05',
      checkOut: '2025-12-08',
      nights: 3,
      guests: 4,
      rooms: 2,
      totalPrice: 10800,
      status: 'pending',
      bookingDate: 'Booked on Oct 20, 2024'
    },
    {
      id: '3',
      hotelName: 'Sunset Beach Resort',
      location: 'Durban',
      checkIn: '2025-09-15',
      checkOut: '2025-09-17',
      nights: 2,
      guests: 2,
      rooms: 1,
      totalPrice: 3000,
      status: 'confirmed',
      bookingDate: 'Booked on Aug 30, 2024'
    },
  ]);

  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigation.replace('SignIn');
      } else {
        setUser(currentUser);
        setName(currentUser.displayName || '');
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start();
      }
    });
    return unsubscribe;
  }, []);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name cannot be empty.');
      return;
    }

    setLoading(true);
    try {
      await updateProfile(auth.currentUser, { displayName: name });
      Alert.alert('Success', 'Profile updated successfully!');
      setEditing(false);
    } catch (error) {
      console.log('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut(auth);
              navigation.replace('SignIn');
            } catch (error) {
              console.log('Logout error:', error);
              Alert.alert('Error', 'Could not log out.');
            }
          }
        },
      ]
    );
  };

  const handleBookingPress = (booking) => {
    // Navigate to booking details or show more info
    Alert.alert(
      'Booking Details',
      `${booking.hotelName}\n${booking.location}\n${booking.checkIn} - ${booking.checkOut}`
    );
  };

  const getInitials = (email) => {
    return email ? email.charAt(0).toUpperCase() : 'U';
  };

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading user info...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFBED" />
      
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>My Profile</Text>
            <TouchableOpacity 
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={20} color="#1E3A8A" />
            </TouchableOpacity>
          </View>

          {/* Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.avatarSection}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {getInitials(user.displayName || user.email)}
                </Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>
                  {user.displayName || 'Add Your Name'}
                </Text>
                <Text style={styles.userEmail}>{user.email}</Text>
                <Text style={styles.memberSince}>Member since 2024</Text>
              </View>
            </View>

            {editing ? (
              <View style={styles.editSection}>
                <Text style={styles.editLabel}>Your Name</Text>
                <TextInput
                  placeholder="Enter your full name"
                  value={name}
                  onChangeText={setName}
                  style={styles.nameInput}
                  autoFocus
                />
                <View style={styles.editButtons}>
                  <TouchableOpacity 
                    style={styles.cancelButton}
                    onPress={() => setEditing(false)}
                    disabled={loading}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[
                      styles.saveButton,
                      loading && styles.saveButtonDisabled
                    ]}
                    onPress={handleSave}
                    disabled={loading}
                  >
                    <Text style={styles.saveButtonText}>
                      {loading ? 'Saving...' : 'Save'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.editProfileButton}
                onPress={() => setEditing(true)}
              >
                <Ionicons name="pencil" size={16} color="#1E3A8A" />
                <Text style={styles.editProfileText}>Edit Profile</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Stats Section */}
          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>Your Travel Stats</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{bookings.length}</Text>
                <Text style={styles.statLabel}>Bookings</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {bookings.reduce((total, booking) => total + booking.nights, 0)}
                </Text>
                <Text style={styles.statLabel}>Nights</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {bookings.filter(b => b.status === 'confirmed').length}
                </Text>
                <Text style={styles.statLabel}>Upcoming</Text>
              </View>
            </View>
          </View>

          {/* Bookings Section */}
          <View style={styles.bookingsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>My Bookings</Text>
              <Text style={styles.bookingsCount}>({bookings.length})</Text>
            </View>

            {bookings.length === 0 ? (
              <View style={styles.emptyBookings}>
                <Ionicons name="calendar-outline" size={64} color="#E5E5E5" />
                <Text style={styles.emptyTitle}>No bookings yet</Text>
                <Text style={styles.emptyText}>
                  Start planning your next adventure!
                </Text>
                <TouchableOpacity 
                  style={styles.exploreButton}
                  onPress={() => navigation.navigate('Explore')}
                >
                  <Text style={styles.exploreButtonText}>Explore Hotels</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <FlatList
                data={bookings}
                scrollEnabled={false}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <BookingCard 
                    booking={item}
                    onPress={() => handleBookingPress(item)}
                  />
                )}
                contentContainerStyle={styles.bookingsList}
              />
            )}
          </View>

          {/* App Info */}
          <View style={styles.appInfo}>
            <Text style={styles.appVersion}>TravelStay v1.0.0</Text>
            <Text style={styles.appTagline}>Your journey begins here</Text>
          </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFBED',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  logoutButton: {
    padding: 8,
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#FEF3C7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1E3A8A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  memberSince: {
    fontSize: 12,
    color: '#999',
  },
  editSection: {
    marginTop: 8,
  },
  editLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E3A8A',
    marginBottom: 8,
  },
  nameInput: {
    borderWidth: 2,
    borderColor: '#FEF3C7',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
    color: '#1E3A8A',
    marginBottom: 12,
  },
  editButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#1E3A8A',
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#CCC',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#1E3A8A',
  },
  editProfileText: {
    color: '#1E3A8A',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#FEF3C7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#F0F0F0',
  },
  bookingsSection: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  bookingsCount: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
  emptyBookings: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 20,
  },
  exploreButton: {
    backgroundColor: '#1E3A8A',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  exploreButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  bookingsList: {
    paddingBottom: 10,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  appVersion: {
    fontSize: 14,
    color: '#999',
    marginBottom: 4,
  },
  appTagline: {
    fontSize: 12,
    color: '#CCC',
  },
});