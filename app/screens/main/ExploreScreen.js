import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  Image,
  Animated,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HotelCard from '../../Components/HotelCard';
import LoadingSpinner from '../../Components/LoadingSpinner';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ExploreScreen({ navigation }) {
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState('rating');
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null);
  const fadeAnim = useState(new Animated.Value(0))[0];

 
  useEffect(() => {
    loadUserData();
    loadHotels();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.log('Error loading user data:', error);
    }
  };

  const loadHotels = () => {
    const sampleHotels = [
      {
        id: '1',
        name: 'The Royal Hotel',
        location: 'Cape Town',
        rating: 4.8,
        price: 2200,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
        amenities: ['wifi', 'pool', 'spa'],
      },
      {
        id: '2',
        name: 'Sunset Lodge',
        location: 'Durban',
        rating: 4.5,
        price: 1500,
        image: 'https://images.unsplash.com/photo-1501117716987-c8e1ecb210d4',
        amenities: ['wifi', 'beach', 'restaurant'],
      },
      {
        id: '3',
        name: 'Mountain View Resort',
        location: 'Drakensberg',
        rating: 4.2,
        price: 1800,
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b',
        amenities: ['wifi', 'hiking', 'fireplace'],
      },
      {
        id: '4',
        name: 'City Center Hotel',
        location: 'Johannesburg',
        rating: 4.0,
        price: 1200,
        image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa',
        amenities: ['wifi', 'gym', 'business'],
      },
      {
        id: '5',
        name: 'Safari Wilderness Lodge',
        location: 'Kruger National Park',
        rating: 4.9,
        price: 3500,
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5',
        amenities: ['pool', 'safari', 'spa'],
      },
    ];

   
    setTimeout(() => {
      setHotels(sampleHotels);
      setFilteredHotels(sampleHotels);
      setLoading(false);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }, 1500);
  };

 
  useEffect(() => {
    let results = hotels;

   
    if (searchQuery) {
      results = results.filter(hotel =>
        hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hotel.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    
    results = [...results].sort((a, b) => {
      if (sortOption === 'price') return a.price - b.price;
      if (sortOption === 'rating') return b.rating - a.rating;
      if (sortOption === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

    setFilteredHotels(results);
  }, [searchQuery, sortOption, hotels]);

  const handleProfilePress = () => {
    navigation.navigate('Profile');
  };

  if (loading) return <LoadingSpinner message="Discovering amazing hotels..." />;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFBED" />
      
     
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello {user?.email?.split('@')[0] || 'Traveler'}! 👋</Text>
          <Text style={styles.subtitle}>Where do you want to stay?</Text>
        </View>
        <TouchableOpacity style={styles.profileButton} onPress={handleProfilePress}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileInitial}>
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

     
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search hotels or locations..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        ) : null}
      </View>

     
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsTitle}>
          {filteredHotels.length} {filteredHotels.length === 1 ? 'Hotel' : 'Hotels'} Found
        </Text>
        
       
        <View style={styles.sortContainer}>
          <Text style={styles.sortLabel}>Sort by:</Text>
          <TouchableOpacity
            style={[styles.sortButton, sortOption === 'rating' && styles.activeSort]}
            onPress={() => setSortOption('rating')}
          >
            <Text style={[styles.sortText, sortOption === 'rating' && styles.activeSortText]}>
              Rating
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortButton, sortOption === 'price' && styles.activeSort]}
            onPress={() => setSortOption('price')}
          >
            <Text style={[styles.sortText, sortOption === 'price' && styles.activeSortText]}>
              Price
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortButton, sortOption === 'name' && styles.activeSort]}
            onPress={() => setSortOption('name')}
          >
            <Text style={[styles.sortText, sortOption === 'name' && styles.activeSortText]}>
              Name
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Hotel List */}
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        {filteredHotels.length > 0 ? (
          <FlatList
            data={filteredHotels}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <HotelCard
                hotel={item}
                onPress={() => navigation.navigate('HotelDetails', { hotel: item })}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.hotelList}
          />
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={64} color="#E5E5E5" />
            <Text style={styles.emptyTitle}>No hotels found</Text>
            <Text style={styles.emptyText}>
              Try adjusting your search terms
            </Text>
            <TouchableOpacity 
              style={styles.resetButton}
              onPress={() => setSearchQuery('')}
            >
              <Text style={styles.resetButtonText}>Clear Search</Text>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFFBED',
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  profileButton: {
    padding: 8,
  },
  profileAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1E3A8A',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileInitial: {
    color: '#FFFBED',
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: '#FEF3C7',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1E3A8A',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    borderWidth: 2,
    borderColor: '#FEF3C7',
  },
  sortLabel: {
    fontSize: 12,
    color: '#666',
    marginHorizontal: 8,
    fontWeight: '600',
  },
  sortButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginHorizontal: 2,
  },
  activeSort: {
    backgroundColor: '#1E3A8A',
  },
  sortText: {
    color: '#666',
    fontSize: 12,
    fontWeight: '600',
  },
  activeSortText: {
    color: '#FFFFFF',
  },
  hotelList: {
    paddingBottom: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
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
  resetButton: {
    backgroundColor: '#1E3A8A',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});