import AsyncStorage from '@react-native-async-storage/async-storage';

export const setOnboardingSeen = async () => {
  try {
    await AsyncStorage.setItem('hasSeenOnboarding', 'true');
  } catch (error) {
    console.log('Error saving onboarding status:', error);
  }
};

export const hasSeenOnboarding = async () => {
  try {
    const value = await AsyncStorage.getItem('hasSeenOnboarding');
    return value === 'true';
  } catch (error) {
    console.log('Error checking onboarding status:', error);
    return false;
  }
};
