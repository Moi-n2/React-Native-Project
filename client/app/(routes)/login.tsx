import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants";
import Fontisto from "@expo/vector-icons/Fontisto";
import Feather from "@expo/vector-icons/Feather";
import { Href, router } from "expo-router";
import http from "@/utils/http";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Toast } from "react-native-toast-notifications";

export default function login() {
  const [loginform, setLoginform] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [buttonSpinner, setButtonSpinner] = useState(false);

  const handleSignIn = async () => {
    if (!loginform.email || !loginform.password) {
      return Toast.show("Please fill email and password", { type: "warning" });
    }
    try {
      const res = await http.post("/login", loginform);
      if (res.data.success) {
        await AsyncStorage.setItem("access_token", res.data.accessToken);
        await AsyncStorage.setItem("fresh_token", res.data.freshToken);
        router.push("/(tabs)");
      }
    } catch (error) {
      console.log(error);
      Toast.show(error as string, { type: "danger" });
    }
  };
  return (
    <SafeAreaView className="bg-rose-50 h-full">
      <ScrollView className="px-5">
        <Image
          source={images.login}
          className="w-full h-[200px]"
          resizeMode="contain"
        />
        <Text className="font-Prata text-3xl py-3 font-bold">
          Welcome Back!
        </Text>
        <Text className="text-base">Login to your account 👋</Text>
        <View className="mt-10 space-y-5">
          <View className="flex-row justify-start items-center bg-gray-100 rounded-lg border border-gray-600 focus:border-red-400 px-3 focus:bg-rose-100">
            <Fontisto name="email" size={20} color="black" />
            <TextInput
              className={`rounded-full px-5 py-3 font-JakartaSemiBold text-[15px] flex-1 text-left`}
              placeholder="Enter email"
              value={loginform.email}
              onChangeText={(val) => setLoginform({ ...loginform, email: val })}
            />
          </View>
          <View className="flex-row justify-start items-center bg-gray-100 rounded-lg border border-gray-600 focus:border-red-400 px-3 focus:bg-rose-100">
            <Fontisto name="locked" size={20} color="black" />
            <TextInput
              className={`rounded-full px-5 py-3 font-JakartaSemiBold text-[15px] flex-1 text-left`}
              placeholder="Enter password"
              value={loginform.password}
              onChangeText={(val) =>
                setLoginform({ ...loginform, password: val })
              }
              secureTextEntry={showPassword}
            />
            {
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                className="pr-2"
              >
                <Feather
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color="black"
                />
              </Pressable>
            }
          </View>

          <TouchableOpacity
            onPress={() => router.push("/(routes)/forgot-password" as Href)}
          >
            <Text className="self-end">Forgot Password?</Text>
          </TouchableOpacity>

          <View>
            <TouchableOpacity
              className="rounded-lg bg-rose-500 p-4"
              onPress={handleSignIn}
            >
              {buttonSpinner ? (
                <ActivityIndicator size="small" color={"white"} />
              ) : (
                <Text className="text-white text-center text-base">
                  Sign In
                </Text>
              )}
            </TouchableOpacity>
          </View>

          <View className="items-center">
            <Text className="font-JakartaSemiBold tracking-wider mb-3">
              - OR Continue with -
            </Text>
            <View className="flex-row items-center justify-center space-x-3">
              <TouchableOpacity>
                <Fontisto name="google" size={24} color="black" />
              </TouchableOpacity>
              <TouchableOpacity>
                <Fontisto name="github" size={24} color="black" />
              </TouchableOpacity>
            </View>

            <View className="flex-row items-baseline gap-2 mt-2">
              <Text className="">Create an Account</Text>
              <TouchableOpacity
                onPress={() => router.push("/(routes)/sign-up" as Href)}
              >
                <Text className="text-red-500 text-base font-JakartaBold tracking-wider underline">
                  Sign-up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
