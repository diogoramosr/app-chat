import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";

import firebase from "../../services/firebaseConnection";

export default function CompChatMessage({ data }) {
  const user = firebase.auth().currentUser.toJSON();

  const isMyMessage = useMemo(() => {
    return data?.user?._id === user.uid;
  }, [data]);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.messageBox,
          {
            backgroundColor: isMyMessage ? "#DCF8C5" : "#fff",
            marginLeft: isMyMessage ? 50 : 0,
            marginRight: isMyMessage ? 0 : 50,
          },
        ]}
      >
        {!isMyMessage && (
          <Text style={styles.name}>{data?.user?.displayName}</Text>
        )}
        <Text style={styles.message}>{data.text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  messageBox: {
    borderRadius: 5,
    padding: 10,
  },
  name: {
    color: "#F53737",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
});
