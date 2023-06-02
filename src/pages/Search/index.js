import React, { useState, useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";

import firebase from "../../services/firebaseConnection";

import CompChatList from "../../components/ChatList";

export default function PageSearch() {
  const isFocused = useIsFocused();

  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);
  const [threads, setThreads] = useState([]);

  useEffect(() => {
    const hasUser = firebase.auth().currentUser
      ? firebase.auth().currentUser.toJSON()
      : null;
    setUser(hasUser);
  }, [isFocused]);

  async function handleSearch() {
    if (search === "") return;

    const response = await firebase
      .firestore()
      .collection("MESSAGE_THREADS")
      .where("name", ">=", search)
      .where("name", "<=", search + "\uf8ff")
      .get()
      .then((snapshot) => {
        const threads = snapshot.docs.map((document) => {
          return {
            _id: document.id,
            name: "",
            lastMessage: { text: "" },
            ...document.data(),
          };
        });
        setThreads(threads);
        setSearch("");
        Keyboard.dismiss();
      });
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
        <View style={styles.containerInput}>
          <TextInput
            style={styles.input}
            placeholder="Digite o nome da sala..."
            value={search}
            onChangeText={(text) => setSearch(text)}
            autoCapitalize="none"
            placeholderTextColor={"#999"}
          />
          <TouchableOpacity style={styles.buttonSearch} onPress={handleSearch}>
            <MaterialIcons name="search" size={30} color="#fff" />
          </TouchableOpacity>
        </View>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={threads}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <CompChatList data={item} userStatus={user} />
          )}
        />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  containerInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginVertical: 14,
  },
  input: {
    backgroundColor: "#F1F1F1",
    marginLeft: 10,
    height: 50,
    width: "80%",
    borderRadius: 4,
    padding: 5,
  },
  buttonSearch: {
    backgroundColor: "#2E54D4",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    width: "15%",
    marginLeft: 5,
    marginRight: 10,
    height: 50,
  },
});
