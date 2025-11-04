import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  StatusBar,
  Animated,
  Dimensions 
} from 'react-native';
import { setOnboardingSeen } from '../../utils/storage';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: 1,
    image: require('../../../assets/Materials/01-Onboarding Page/Onboarding 1.png'),
    title: 'Browse Hotels',
    text: 'Easily explore top-rated hotels from around the world.',
  },
  {
    id: 2,
    image: require('../../../assets/Materials/01-Onboarding Page/Onboarding 2.png'),
    title: 'Book Your Stay',
    text: 'Reserve rooms quickly and securely with just a few taps.',
  },
  {
    id: 3,
    image: require('../../../assets/Materials/01-Onboarding Page/Onboarding 3.png'),
    title: 'Enjoy Your Trip',
    text: 'Get 24/7 support and exclusive offers while traveling.',
  },
];

export default function OnboardingScreen({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useState(new Animated.Value(1))[0];

  const animateTransition = () => {
    // Fade out
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      // Fade in after state update
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  const nextSlide = async () => {
    if (currentIndex < slides.length - 1) {
      animateTransition();
      setCurrentIndex(currentIndex + 1);
    } else {
      await setOnboardingSeen();
      navigation.replace('SignIn');
    }
  };

  const skipOnboarding = async () => {
    await setOnboardingSeen();
    navigation.replace('SignIn');
  };

  const goToSlide = (slideIndex) => {
    animateTransition();
    setCurrentIndex(slideIndex);
  };

  const { image, title, text } = slides[currentIndex];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Skip Button */}
      <TouchableOpacity style={styles.skipButton} onPress={skipOnboarding}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Image source={image} style={styles.image} />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.text}>{text}</Text>
      </Animated.View>

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <TouchableOpacity 
            key={index} 
            onPress={() => goToSlide(index)}
            style={styles.dotContainer}
          >
            <View 
              style={[
                styles.dot, 
                currentIndex === index ? styles.activeDot : styles.inactiveDot
              ]} 
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Next/Get Started Button */}
      <TouchableOpacity 
        style={[
          styles.button, 
          currentIndex === slides.length - 1 && styles.getStartedButton
        ]} 
        onPress={nextSlide}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>
          {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: height * 0.05,
  },
  skipButton: {
    alignSelf: 'flex-end',
    padding: 10,
    marginBottom: 20,
  },
  skipText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: { 
    width: width * 0.7, 
    height: height * 0.35, 
    resizeMode: 'contain', 
    marginBottom: 40,
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginBottom: 16,
    color: '#1A1A1A',
    textAlign: 'center',
  },
  text: { 
    textAlign: 'center', 
    fontSize: 16, 
    color: '#666', 
    marginBottom: 40,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  dotContainer: {
    padding: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#007AFF',
    width: 24,
  },
  inactiveDot: {
    backgroundColor: '#E5E5E5',
  },
  button: { 
    backgroundColor: '#007AFF', 
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginBottom: height * 0.05,
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  getStartedButton: {
    backgroundColor: '#34C759',
    shadowColor: '#34C759',
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: '600',
  },
});