import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

export default function _layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="sign-up" />
      <Stack.Screen name="login" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen
        name="product/[id]"
        options={{
          headerShown: true,
          headerTitle: "",
          headerTransparent: true,
        }}
      />
      <Stack.Screen
        name="verify-account"
        options={{
          headerShown: true,
          title: "Verify Account",
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="my-address"
        options={{
          headerShown: true,
          title: "My Address",
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="my-order"
        options={{
          headerShown: true,
          title: "My Order",
          headerBackTitle: "Back",
        }}
      />
    </Stack>
  );
}
