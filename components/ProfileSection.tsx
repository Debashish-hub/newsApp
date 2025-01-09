import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Button,
  TextInput,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import { loadProfilePic, saveProfilePic } from "@/hooks/handleProfileDetails";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";


const ProfilePictureSection = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [name, setName] = useState('');
  const [isEditingName, setIsEditingName] = useState(false); 

  useEffect(() => {
    const loadProfile = async () => {
      const uri = await loadProfilePic();
      setProfilePic(uri);
    };
    loadProfile();
  }, []);

  useEffect(() => {
    const loadProfileName = async () => {
      const savedName = await AsyncStorage.getItem('profileName');
      if (savedName) {
        setName(savedName);
      }
    };
    loadProfileName();
  }, []);

  const handleSaveName = async () => {
    await AsyncStorage.setItem('profileName', name);
    setName(name);
  };

  const selectImage = async () => {
    // Ask for permissions
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Permission Denied",
        "We need access to your photo library to select an image."
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePic(result.assets[0].uri);
      saveProfilePic(result.assets[0].uri);
      Alert.alert("Success", "Profile Picture set successfully");
    } else {
      Alert.alert("Cancelled", "You did not select any image.");
    }
  };
  const handleNameSave = () => {
    setIsEditingName(false);
    Alert.alert('Name Saved', `Your name is now: ${name}`);
    handleSaveName();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={selectImage}>
        <View style={styles.imageContainer}>
          {profilePic ? (
            <Image source={{ uri: profilePic }} style={styles.image} />
          ) : (
            //<Image source={{ uri: tempUrl }} style={styles.image} />
            <Text style={styles.placeholderText}>Tap to select a photo</Text>
          )}
        </View>
        <TouchableOpacity style={styles.editIcon} onPress={selectImage}>
          <MaterialIcons name="edit" size={24} color={Colors.white} />
        </TouchableOpacity>
      </TouchableOpacity>

      <View style={styles.nameContainer}>
        {isEditingName ? (
          <TextInput
            style={styles.nameInput}
            value={name}
            onChangeText={setName}
            onSubmitEditing={handleNameSave} // Save when user presses enter
            autoFocus
          />
        ) : (
          <TouchableOpacity onPress={() => setIsEditingName(true)}>
            <Text style={styles.nameText}>{name}</Text>
            <View style={styles.nameEditIcon}>
                <MaterialIcons name="edit" size={10} color={Colors.white} />
            </View>
          </TouchableOpacity>
        )}
      </View>

      {isEditingName && (
        <TouchableOpacity style={styles.button} onPress={handleNameSave}>
            <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
  },
  imageContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: Colors.lightGrey,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholderText: {
    fontSize: 16,
    color: Colors.lightGrey,
    textAlign: "center",
  },
  editIcon: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: Colors.darkGrey,
    borderRadius: 15,
    padding: 5,
  },
  nameEditIcon: {
    position: 'absolute',
    backgroundColor: Colors.darkGrey,
    borderRadius: 15,
    right: -30,
    padding: 5,
  },
  nameContainer: {
    marginVertical: 20,
  },
  nameText: {
    fontSize: 18,
    fontWeight: '600',
  },
  nameInput: {
    fontSize: 18,
    borderBottomWidth: 1,
    borderColor: Colors.lightGrey,
    width: 200,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: Colors.tint,
    padding: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '700',
  }
});

export default ProfilePictureSection;
