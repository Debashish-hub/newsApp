
// ProfileUtils.tsx (utility functions for AsyncStorage)
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export const saveProfilePic = async (uri: string | null) => {
  try {
    await AsyncStorage.setItem('profilePic', uri ?? '');
  } catch (error) {
    Alert.alert('Failed to save profile picture:', error.message);
    console.error('Failed to save profile picture:', error);
  }
};

export const loadProfilePic = async (): Promise<string | null> => {
  try {
    const uri = await AsyncStorage.getItem('profilePic');
    return uri;
  } catch (error) {
    Alert.alert('Failed to load profile picture:', error.message);
    console.error('Failed to load profile picture:', error);
    return null;
  }
};
