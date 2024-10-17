import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import Color from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";

export type TabParamList = {
  home: undefined; // 如果没有参数
  search: { filter: string | string[]; isSub: boolean }; // 定义 `search` 页面接受的参数
  cart: undefined; // 如果没有参数
  profile: undefined; // 如果没有参数
};

export default function _layout() {
  return (
    <SafeAreaView className="flex-1">
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Color.primary,
          tabBarLabelStyle: {
            fontFamily: "OutfitSemiBold",
          },
          tabBarStyle: { padding: 6 },
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            tabBarLabel: "Home",
            tabBarIcon: ({ size, color }) => (
              <Feather name="home" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            tabBarLabel: "Search",
            tabBarIcon: ({ size, color }) => (
              <Feather name="search" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="cart"
          options={{
            tabBarLabel: "Cart",
            tabBarIcon: ({ size, color }) => (
              <Feather name="shopping-cart" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            tabBarLabel: "Pofile",
            tabBarIcon: ({ size, color }) => (
              <Feather name="user" size={size} color={color} />
            ),
            headerShown: true,
            headerTransparent: true,
            headerTitle: "",
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
