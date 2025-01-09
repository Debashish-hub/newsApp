import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { loadProfilePic } from "@/hooks/handleProfileDetails";
import { router, useFocusEffect, useNavigation } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Props = {};

const Header = (props: Props) => {
  const [profilePic, setProfilePic] = useState(null);
  const [name, setName] = useState("");
  const navigation = useNavigation();
  useEffect(() => {
    const loadProfileName = async () => {
      const savedName = await AsyncStorage.getItem("profileName");
      if (savedName) {
        setName(savedName);
      }
    };
    loadProfileName();
  }, []);
  useEffect(() => {
    const loadProfile = async () => {
      const uri = await loadProfilePic();
      setProfilePic(uri);
    };
    loadProfile();
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      const loadProfileAndName = async () => {
        const uri = await loadProfilePic();
        setProfilePic(uri);
        const savedName = await AsyncStorage.getItem("profileName");
        if (savedName) {
          setName(savedName);
        }
      };
      loadProfileAndName();
    }, [])
  );
  return (
    <View style={styles.container}>

      {/* <TouchableOpacity onPress={() => {router.push("/settings")}}> */}
      <TouchableOpacity onPress={() => {navigation.navigate("settings")}}>
      <View style={styles.userInfo}>
        <Image source={{ uri: profilePic }} style={styles.userLogo} />
        <View style={{ gap: 3 }}>
          <Text style={styles.welcomeText}>Welcome</Text>
          <Text style={styles.userName}>{name}!</Text>
        </View>
      </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {}}>
        <Ionicons name="notifications-outline" size={24} color={Colors.black} />
      </TouchableOpacity>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  welcomeText: {
    fontSize: 12,
    color: Colors.darkGrey,
  },
  userName: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.black,
  },
});
