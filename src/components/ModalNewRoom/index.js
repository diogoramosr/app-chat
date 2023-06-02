import React, { useState } from "react";

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";

import firebase from "../../services/firebaseConnection";

export default function CompModalNewRoom({ setVisible, setUpdateScreen }) {
  const [newRoom, setNewRoom] = useState("");

  const user = firebase.auth().currentUser.toJSON();

  function handleButtonCreate() {
    if (newRoom === "") return;

    // CREATE 4 ROOMS
    firebase
      .firestore()
      .collection("MESSAGE_THREADS")
      .get()
      .then((snapshot) => {
        let contador = 0;

        snapshot.docs.map((docItem) => {
          if (docItem.data().owner === user.uid) {
            contador += 1;
          }
        });
        if (contador >= 10) {
          alert("Você atingiu o limite de grupos por usuário!");
        } else {
          createRoom();
        }
      });
  }

  // CREATE ROOM FUNCTION
  function createRoom() {
    firebase
      .firestore()
      .collection("MESSAGE_THREADS")
      .add({
        name: newRoom,
        owner: user.uid,
        lastMessage: {
          text: `Grupo ${newRoom} criado. `,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        },
      })
      .then((docRef) => {
        docRef
          .collection("MESSAGES")
          .add({
            text: `Grupo ${newRoom}  criado. Bem-vindo(a)!`,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            system: true,
          })
          .then(() => {
            setVisible();
            setUpdateScreen();
          });
      })
      .catch((error) => {
        console.log("Não foi possível criar o grupo. Error: " + error);
      });
  }

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={setVisible}>
        <View style={styles.modal}></View>
      </TouchableWithoutFeedback>

      <View style={styles.modalContainer}>
        <Text style={styles.title}>Criar um novo Grupo</Text>
        <TextInput
          value={newRoom}
          onChangeText={(text) => setNewRoom(text)}
          style={styles.input}
          placeholder="Nome do Grupo"
          placeholderTextColor={"#999"}
        />
        <TouchableOpacity
          style={styles.buttonCreate}
          onPress={handleButtonCreate}
        >
          <Text style={styles.buttonText}>Criar sala</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(34,34,34,0.4)",
  },
  modal: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 15,
  },
  title: {
    marginTop: 14,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    borderRadius: 4,
    height: 45,
    backgroundColor: "#DDD",
    marginVertical: 15,
    fontSize: 16,
    paddingHorizontal: 15,
  },
  buttonCreate: {
    borderRadius: 4,
    height: 45,
    backgroundColor: "#2E54D4",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
  },
});
