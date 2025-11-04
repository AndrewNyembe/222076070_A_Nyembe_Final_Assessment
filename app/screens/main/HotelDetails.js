import React, { useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  Modal, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  StyleSheet,
  ScrollView,
  Image,
  StatusBar,
  Animated
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../../../firebase/firebaseConfig';

export default function HotelDetails({ route }) {
  const navigation = useNavigation();
  const { hotel } = route.params;
  const fadeAnim = useState(new Animated.Value(0))[0];

  const [reviews, setReviews] = useState([
    { 
      id: '1', 
      name: 'Lerato M.', 
      rating: 5, 
      text: 'Amazing hotel! Super clean and friendly staff. The location was perfect for exploring the city.',
      date: '2 weeks ago'
    },
    { 
      id: '2', 
      name: 'Thabo S.', 
      rating: 4, 
      text: 'Great location and comfortable rooms. Breakfast was delicious with good variety.',
      date: '1 month ago'
    },
    { 
      id: '3', 
      name: 'Sarah K.', 
      rating: 5, 
      text: 'Absolutely loved our stay! The pool area was fantastic and the room was spacious.',
      date: '3 days ago'
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleBooking = () => {
    if (!auth.currentUser) {
      Alert.alert('Login Required', 'Please sign in to book this hotel.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign In', onPress: () => navigation.navigate('SignIn') },
      ]);
    } else {
      navigation.navigate('Booking', { hotel });
    }
  };

  const handleAddReview = () => {
    if (!auth.currentUser) {
      Alert.alert('Login Required', 'Please sign in to add a review.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign In', onPress: () => navigation.navigate('SignIn') },
      ]);
      return;
    }
    setModalVisible(true);
  };

  const handleSubmitReview = () => {
    if (!newReview.trim() || newRating === 0) {
      Alert.alert('Missing Info', 'Please provide a rating and comment.');
      return;
    }

    const review = {
      id: Date.now().toString(),
      name: auth.currentUser?.displayName || auth.currentUser?.email?.split('@')[0] || 'Guest',
      rating: newRating,
      text: newReview,
      date: 'Just now'
    };

    setReviews([review, ...reviews]);
    setModalVisible(false);
    setNewReview('');
    setNewRating(0);
    setSubmitted(true);
    
    setTimeout(() => setSubmitted(false), 3000);
  };

  const renderStars = (rating, size = 16) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= rating ? "star" : "star-outline"}
            size={size}
            color="#F59E0B"
          />
        ))}
        <Text style={styles.ratingText}>({rating}.0)</Text>
      </View>
    );
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const averageRating = calculateAverageRating();

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
            <Text style={styles.headerTitle}>Hotel Details</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Hotel Image */}
          <Image 
            source={{ uri: hotel.image }} 
            style={styles.hotelImage}
            resizeMode="cover"
          />

          {/* Hotel Info */}
          <View style={styles.hotelInfo}>
            <Text style={styles.hotelName}>{hotel.name}</Text>
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={16} color="#666" />
              <Text style={styles.hotelLocation}>{hotel.location}</Text>
            </View>
            
            <View style={styles.ratingRow}>
              {renderStars(Math.round(averageRating), 20)}
              <Text style={styles.reviewCount}>({reviews.length} reviews)</Text>
            </View>

            <View style={styles.priceContainer}>
              <Text style={styles.price}>R{hotel.price}</Text>
              <Text style={styles.night}> / night</Text>
            </View>
          </View>

          {/* Amenities */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Amenities</Text>
            <View style={styles.amenitiesGrid}>
              <View style={styles.amenityItem}>
                <Ionicons name="wifi" size={20} color="#1E3A8A" />
                <Text style={styles.amenityText}>Free WiFi</Text>
              </View>
              <View style={styles.amenityItem}>
                <Ionicons name="restaurant" size={20} color="#1E3A8A" />
                <Text style={styles.amenityText}>Restaurant</Text>
              </View>
              <View style={styles.amenityItem}>
                <Ionicons name="water" size={20} color="#1E3A8A" />
                <Text style={styles.amenityText}>Pool</Text>
              </View>
              <View style={styles.amenityItem}>
                <Ionicons name="fitness" size={20} color="#1E3A8A" />
                <Text style={styles.amenityText}>Gym</Text>
              </View>
            </View>
          </View>

          {/* Book Button */}
          <TouchableOpacity style={styles.bookButton} onPress={handleBooking}>
            <Text style={styles.bookButtonText}>Book Now</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Reviews Section */}
          <View style={styles.section}>
            <View style={styles.reviewsHeader}>
              <Text style={styles.sectionTitle}>Guest Reviews</Text>
              <View style={styles.averageRating}>
                <Text style={styles.averageRatingText}>{averageRating}</Text>
                <Ionicons name="star" size={16} color="#F59E0B" />
              </View>
            </View>

            {reviews.length === 0 ? (
              <Text style={styles.noReviews}>No reviews yet. Be the first to review!</Text>
            ) : (
              <FlatList
                data={reviews}
                scrollEnabled={false}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={styles.reviewCard}>
                    <View style={styles.reviewHeader}>
                      <Text style={styles.reviewerName}>{item.name}</Text>
                      <Text style={styles.reviewDate}>{item.date}</Text>
                    </View>
                    {renderStars(item.rating)}
                    <Text style={styles.reviewText}>{item.text}</Text>
                  </View>
                )}
              />
            )}

            {submitted && (
              <View style={styles.successMessage}>
                <Ionicons name="checkmark-circle" size={20} color="#34C759" />
                <Text style={styles.successText}>Thanks for your review!</Text>
              </View>
            )}

            {!submitted && (
              <TouchableOpacity style={styles.addReviewButton} onPress={handleAddReview}>
                <Ionicons name="pencil" size={16} color="#1E3A8A" />
                <Text style={styles.addReviewText}>Add Review</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </Animated.View>

      {/* Add Review Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Your Review</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <Text style={styles.ratingLabel}>Your Rating</Text>
            <View style={styles.starsPicker}>
              {[1, 2, 3, 4, 5].map((num) => (
                <TouchableOpacity 
                  key={num} 
                  onPress={() => setNewRating(num)}
                  style={styles.starButton}
                >
                  <Ionicons
                    name={num <= newRating ? "star" : "star-outline"}
                    size={32}
                    color="#F59E0B"
                  />
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.ratingLabel}>Your Review</Text>
            <TextInput
              placeholder="Share your experience with this hotel..."
              style={styles.reviewInput}
              multiline
              numberOfLines={4}
              value={newReview}
              onChangeText={setNewReview}
              textAlignVertical="top"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.submitButton,
                  (!newReview.trim() || newRating === 0) && styles.submitButtonDisabled
                ]}
                onPress={handleSubmitReview}
                disabled={!newReview.trim() || newRating === 0}
              >
                <Text style={styles.submitButtonText}>Submit Review</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  placeholder: {
    width: 40,
  },
  hotelImage: {
    width: '100%',
    height: 250,
  },
  hotelInfo: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 2,
    borderBottomColor: '#FEF3C7',
  },
  hotelName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  hotelLocation: {
    fontSize: 16,
    color: '#666',
    marginLeft: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    fontWeight: '600',
  },
  reviewCount: {
    fontSize: 14,
    color: '#666',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  night: {
    fontSize: 16,
    color: '#666',
    marginLeft: 4,
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginTop: 2,
    borderBottomWidth: 2,
    borderBottomColor: '#FEF3C7',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 16,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 12,
  },
  amenityText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  bookButton: {
    flexDirection: 'row',
    backgroundColor: '#1E3A8A',
    margin: 20,
    padding: 18,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  averageRating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  averageRatingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginRight: 4,
  },
  noReviews: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginVertical: 20,
  },
  reviewCard: {
    backgroundColor: '#FAFAFA',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#FEF3C7',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E3A8A',
  },
  reviewDate: {
    fontSize: 12,
    color: '#999',
  },
  reviewText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginTop: 8,
  },
  successMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  successText: {
    color: '#166534',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  addReviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
    borderWidth: 2,
    borderColor: '#1E3A8A',
  },
  addReviewText: {
    color: '#1E3A8A',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 24,
    width: '90%',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FEF3C7',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E3A8A',
    marginBottom: 12,
  },
  starsPicker: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  starButton: {
    padding: 8,
  },
  reviewInput: {
    borderWidth: 2,
    borderColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    height: 120,
    marginBottom: 20,
    backgroundColor: '#FAFAFA',
    color: '#1E3A8A',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    marginRight: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#1E3A8A',
    marginLeft: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#CCC',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});