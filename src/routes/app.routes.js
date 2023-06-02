import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
const Stack = createNativeStackNavigator();

import PageSignIn from "../pages/SignIn";
import PageChatRoom from "../pages/ChatRoom";
import PageSearch from "../pages/Search";
import PageMessages from "../pages/Messages";

export default function AppRoutes() {
  return (
    <Stack.Navigator initialRouteName="ChatRoom">
      <Stack.Screen
        name="SignIn"
        component={PageSignIn}
        options={{
          title: "Faça login",
        }}
      />

      <Stack.Screen
        name="ChatRoom"
        component={PageChatRoom}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Messages"
        component={PageMessages}
        options={({ route }) => ({
          title: route.params.thread.name,
        })}
      />

      <Stack.Screen
        name="Search"
        component={PageSearch}
        options={{ title: "Conversas" }}
      />
    </Stack.Navigator>
  );
}
