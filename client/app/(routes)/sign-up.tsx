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
import http, { ApiResponse } from "@/utils/http";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Toast } from "react-native-toast-notifications";

type SignupForm = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export default function signUp() {
  const [signupForm, setSignupForm] = useState<SignupForm>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [buttonSpinner, setButtonSpinner] = useState(false);

  const validateForm = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    const isInvalid = (
      ["firstName", "lastName", "email", "password"] as Array<keyof SignupForm>
    ).some((item) => {
      if (!signupForm[item]) {
        Toast.show(`Please enter ${item}`, {
          type: "warning",
        });
        return true; // 返回 true 以终止循环
      }
      return false; // 返回 false 继续循环
    });
    if (isInvalid) {
      return false;
    }
    if (!emailRegex.test(signupForm.email)) {
      Toast.show(`Invalid email address`, {
        type: "warning",
      });

      return false;
    }

    if (!passwordRegex.test(signupForm.password)) {
      Toast.show(
        `Password must be at least 6 characters long. It contains both uppercase and lowercase letters.`,
        {
          type: "warning",
        }
      );
      return false;
    }

    return true;
  };

  const handleSignUp = async () => {
    const test = validateForm();
    if (!test) return;
    setButtonSpinner(true);
    try {
      const res: ApiResponse = await http.post("/sign-up", signupForm);
      if (res.success) {
        await AsyncStorage.setItem(
          "activation_token",
          res.data.activationToken
        );
        Toast.show(res.message, { type: "success" });
        setSignupForm({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
        });
        setButtonSpinner(false);
        router.push("/(routes)/verify-account" as Href);
      }
    } catch (error) {
      setButtonSpinner(false);
      Toast.show(error as string, {
        type: "danger",
      });
    }
  };
  return (
    <SafeAreaView className="bg-rose-50 h-full">
      <ScrollView className="px-5">
        <Image
          source={images.signup}
          className="w-full h-[200px]"
          resizeMode="contain"
        />
        <Text className="font-Prata text-3xl py-3 font-bold">
          Let's get started!
        </Text>
        <Text className="text-base">Create an account to join in 👋</Text>
        <View className="mt-10 space-y-5">
          <View className="flex-row justify-between items-center">
            <View className="flex-row justify-start items-center bg-gray-100 rounded-lg border border-gray-600 focus:border-red-400 px-3 focus:bg-rose-100">
              <Feather name="user" size={20} color="black" />
              <TextInput
                className={`rounded-full px-5 py-3 font-OutfitBold text-[15px] flex-1 text-left`}
                placeholder="FirstName"
                value={signupForm.firstName}
                onChangeText={(val) =>
                  setSignupForm({ ...signupForm, firstName: val })
                }
              />
              <TextInput
                className={`rounded-full px-5 py-3 font-OutfitBold text-[15px] flex-1 text-left`}
                placeholder="LastName"
                value={signupForm.lastName}
                onChangeText={(val) =>
                  setSignupForm({ ...signupForm, lastName: val })
                }
              />
            </View>
          </View>
          <View className="flex-row justify-start items-center bg-gray-100 rounded-lg border border-gray-600 focus:border-red-400 px-3 focus:bg-rose-100">
            <Fontisto name="email" size={20} color="black" />
            <TextInput
              className={`rounded-full px-5 py-3 font-OutfitBold text-[15px] flex-1 text-left`}
              placeholder="Enter email"
              value={signupForm.email}
              onChangeText={(val) =>
                setSignupForm({ ...signupForm, email: val })
              }
            />
          </View>
          <View className="flex-row justify-start items-center bg-gray-100 rounded-lg border border-gray-600 focus:border-red-400 px-3 focus:bg-rose-100">
            <Fontisto name="locked" size={20} color="black" />
            <TextInput
              className={`rounded-full px-5 py-3 font-OutfitBold text-[15px] flex-1 text-left`}
              placeholder="Enter password"
              value={signupForm.password}
              onChangeText={(val) =>
                setSignupForm({ ...signupForm, password: val })
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

          <View>
            <TouchableOpacity
              className="rounded-lg bg-rose-500 p-4"
              onPress={handleSignUp}
            >
              {buttonSpinner ? (
                <ActivityIndicator size="small" color={"white"} />
              ) : (
                <Text className="text-white text-center text-base font-bold">
                  Sign Up
                </Text>
              )}
            </TouchableOpacity>
          </View>

          <View className="items-center">
            <Text className="font-OutfitBold tracking-wider mb-3">
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
              <Text className="">Already have an Account?</Text>
              <TouchableOpacity
                onPress={() => router.push("/(routes)/login" as Href)}
              >
                <Text className="text-red-500 text-base font-bold tracking-wider underline ">
                  Sign-in
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
