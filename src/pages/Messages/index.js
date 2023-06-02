import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Keyboard,
  TouchableWithoutFeedback,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
} from "react-native";

import firebase from "../../services/firebaseConnection";
import CompChatMessage from "../../components/ChatMessage";

import { Feather } from "@expo/vector-icons";

export default function PageMessages({ route }) {
  const { thread } = route.params;
  const [messages, setMessages] = useState([]);
  const [textInput, setTextInput] = useState("");

  const user = firebase.auth().currentUser.toJSON();

  useEffect(() => {
    const unsubscribeListener = firebase
      .firestore()
      .collection("MESSAGE_THREADS")
      .doc(thread._id)
      .collection("MESSAGES")
      .orderBy("createdAt", "desc")
      .onSnapshot((querySnapshot) => {
        const messages = querySnapshot.docs.map((doc) => {
          const firebaseData = doc.data();

          let data = {
            _id: doc.id,
            text: "",
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            ...firebaseData,
          };
          if (!firebaseData.system) {
            data.user = {
              ...firebaseData.user,
              name: firebaseData.user.displayName,
            };
          }
          return data;
        });
        setMessages(messages);
      });
    return () => unsubscribeListener();
  }, []);

  async function handleSend() {
    if (textInput === "") return;
    await firebase
      .firestore()
      .collection("MESSAGE_THREADS")
      .doc(thread._id)
      .collection("MESSAGES")
      .add({
        text: textInput,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        user: {
          _id: user.uid,
          displayName: user.displayName,
        },
      });

    await firebase
      .firestore()
      .collection("MESSAGE_THREADS")
      .doc(thread._id)
      .set(
        {
          lastMessage: {
            text: textInput,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          },
        },
        { merge: true }
      );
    setTextInput("");
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <FlatList
          style={{ width: "100%" }}
          data={messages}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <CompChatMessage data={item} />}
          inverted={true}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ width: "100%" }}
          keyboardVerticalOffset={65}
        >
          <View style={styles.containerInput}>
            <View style={styles.mainContainerInput}>
              <TextInput
                placeholder="Sua mensagem..."
                style={styles.textInput}
                value={textInput}
                onChangeText={(text) => setTextInput(text)}
                multiline={true}
                autoCorrect={false}
              />
            </View>

            <TouchableOpacity onPress={handleSend}>
              <View style={styles.buttonContainer}>
                <Feather name="send" size={22} color="#FFF" />
              </View>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  containerInput: {
    flexDirection: "row",
    margin: 10,
    alignItems: "center",
  },
  mainContainerInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    flex: 1,
    borderRadius: 25,
    marginRight: 10,
    paddingVertical: 15,
  },
  textInput: {
    flex: 1,
    marginHorizontal: 10,
    maxHeight: 150,
  },
  buttonContainer: {
    backgroundColor: "#51C880",
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 25,
  },
});
