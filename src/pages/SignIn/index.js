import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";

import firebase from "../../services/firebaseConnection";

export default function PageSignIn() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState(false);

  const navigation = useNavigation();

  function handleLogin() {
    if (type) {
      if (name === "" || email === "" || password === "") {
        alert("Preencha todos os campos");
        return;
      }
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((user) => {
          user.user
            .updateProfile({
              displayName: name,
            })
            .then(() => {
              navigation.navigate("ChatRoom");
            });
        })
        .catch((error) => {
          if (error.code === "auth/email-already-in-use") {
            console.log("Esse e-mail já está sendo usado");
            return;
          }

          if (error.code === "auth/invalid-email") {
            console.log("E-mail inválido");
            return;
          }
        });
    } else {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
          navigation.navigate("ChatRoom");
        })
        .catch((error) => {
          if (error.code === "auth/wrong-password") {
            console.log("Senha incorreta");
            return;
          }

          if (error.code === "auth/user-not-found") {
            console.log("Usuário não encontrado");
            return;
          }

          if (error.code === "auth/invalid-email") {
            console.log("E-mail inválido");
            return;
          }
        });
    }
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.logo}>HeyGrupos</Text>
        <Text style={{ marginBottom: 20 }}>
          Ajude, colabore, faça networking !
        </Text>

        {type && (
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={(text) => setName(text)}
            placeholder="Username"
            placeholderTextColor="#99999B"
          />
        )}

        <TextInput
          style={styles.input}
          value={email}
          onChangeText={(text) => setEmail(text)}
          placeholder="Endereço de e-mail"
          placeholderTextColor="#99999B"
        />

        <TextInput
          style={styles.input}
          value={password}
          onChangeText={(text) => setPassword(text)}
          placeholder="Senha"
          placeholderTextColor="#99999B"
          secureTextEntry={true}
        />

        <TouchableOpacity
          style={[
            styles.buttonLogin,
            { backgroundColor: type ? "#F53745" : "#2E54D4" },
          ]}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>{type ? "Cadastrar" : "Entrar"}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setType(!type)}>
          <Text>{type ? "Já possuo uma conta" : "Criar uma conta"}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  logo: {
    marginTop: Platform.OS === "android" ? 55 : 80,
    fontSize: 30,
    fontWeight: "bold",
  },
  input: {
    color: "#121212",
    backgroundColor: "#EBEBEB",
    width: "90%",
    borderRadius: 6,
    marginBottom: 10,
    paddingHorizontal: 8,
    padding: Platform.OS === "android" ? 0 : 0,
    height: 50,
  },
  buttonLogin: {
    width: "90%",
    height: 50,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});
