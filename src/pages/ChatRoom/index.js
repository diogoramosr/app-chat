import React, { useState, useEffect } from "react";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  StatusBar,
  Modal,
  ActivityIndicator,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import firebase from "../../services/firebaseConnection";

import CompFabButton from "../../components/FabButton";
import CompModalNewRoom from "../../components/ModalNewRoom";
import CompChatList from "../../components/ChatList";

export default function PageChatRoom() {
  const [modalVisible, setModalVisible] = useState(false);
  const [user, setUser] = useState(null);
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    const hasUser = firebase.auth().currentUser
      ? firebase.auth().currentUser.toJSON()
      : null;

    setUser(hasUser);
  }, [isFocused]);

  useEffect(() => {
    let isActive = true;

    function getChats() {
      firebase
        .firestore()
        .collection("MESSAGE_THREADS")
        .orderBy("lastMessage.createdAt", "desc")
        .limit(10)
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
          if (isActive) {
            setThreads(threads);
            setLoading(false);
          }
        });
    }
    getChats();

    return () => {
      isActive = false;
    };
  }, [isFocused, refreshing]);

  function handleSignOut() {
    firebase
      .auth()
      .signOut()
      .then(() => {
        setUser(null);

        navigation.navigate("SignIn");
      })
      .catch((error) => {
        console.log("Não foi possível deslogar. Error: " + error);
      });
  }

  function deleteRoom(ownerId, idRoom) {
    if (ownerId !== user?.uid) return;
    Alert.alert("Atenção!", "Você tem certeza que deseja deletar essa sala?", [
      {
        text: "Cancelar",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "Confirmar",
        onPress: () => handleDeleteRoom(idRoom),
      },
    ]);
  }

  async function handleDeleteRoom(idRoom) {
    await firebase
      .firestore()
      .collection("MESSAGE_THREADS")
      .doc(idRoom)
      .delete();

    setRefreshing(!refreshing);
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color="#2E54D4" size={50} />
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <StatusBar backgroundColor="#2E54D4" />
        <View style={styles.headerRoom}>
          <View style={styles.headerRoomLeft}>
            {user && (
              <TouchableOpacity onPress={handleSignOut}>
                <MaterialIcons name="arrow-back" size={28} color="#FFF" />
              </TouchableOpacity>
            )}
            <Text style={styles.title}>Grupos</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("Search")}>
            <MaterialIcons name="search" size={28} color="#FFF" />
          </TouchableOpacity>
        </View>

        <FlatList
          showsVerticalScrollIndicator={false}
          data={threads}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <CompChatList
              data={item}
              deleteRoom={() => deleteRoom(item.owner, item._id)}
              userStatus={user}
            />
          )}
        />

        <CompFabButton
          setVisible={() => setModalVisible(true)}
          userStatus={user}
        />
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}
        >
          <CompModalNewRoom
            setVisible={() => setModalVisible(false)}
            setUpdateScreen={() => setRefreshing(!refreshing)}
          />
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  headerRoom: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 10,
    backgroundColor: "#2E54D4",
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  headerRoomLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFF",
    paddingLeft: 10,
  },
});
