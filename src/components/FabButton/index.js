import React from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function CompFabButton({ setVisible, userStatus }) {
  const navigation = useNavigation();

  function handleNavigateButton() {
    userStatus ? setVisible() : navigation.navigate("SignIn");
  }

  return (
    <TouchableOpacity
      style={styles.containerButton}
      activeOpacity={0.9}
      onPress={handleNavigateButton}
    >
      <View>
        <Text style={styles.text}>+</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  containerButton: {
    position: "absolute",
    backgroundColor: "#2E54D4",
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    right: "6%",
    bottom: "5%",
    elevation: 2,
    zIndex: 9,
  },
  text: {
    fontSize: 27,
    color: "#FFF",
    fontWeight: "bold",
  },
});
