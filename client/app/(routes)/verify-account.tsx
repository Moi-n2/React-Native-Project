import {
  View,
  Text,
  TextInput,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Toast } from "react-native-toast-notifications";
import http, { ApiResponse } from "@/utils/http";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function verifyAccount() {
  const [code, setCode] = useState(["", "", "", ""]);
  const inputRef = useRef<any>(["", "", "", ""].map(() => React.createRef()));
  const [buttonSpinner, setButtonSpinner] = useState(false);

  const handleInput = (val: string, index: number) => {
    const copyCode = code.slice();
    copyCode[index] = val;
    setCode(copyCode);
  };
  const handleSubmit = async () => {
    if (code.join("").length !== 4)
      return Toast.show("Missing verification code", { type: "warning" });
    try {
      const activation_token = await AsyncStorage.getItem("activation_token");
      const activation_code = code.join("");
      const res: ApiResponse = await http.post("/activate-user", {
        activation_token,
        activation_code,
      });
      if (res.success) {
        Toast.show("Your account activated successfully!", {
          type: "success",
        }),
          setCode(["", "", "", ""]);
        router.push("/(routes)/login");
      }
    } catch (error) {
      Toast.show(error as string, { type: "danger" });
    }
  };
  return (
    <SafeAreaView className="py-16 bg-rose-50 h-full px-5">
      <Text className="text-2xl font-bold mb-10 text-center">
        Verification Code
      </Text>
      <Text className="text-xl mb-10 text-center px-2">
        We have sent the verification code to your email address
      </Text>
      <View className="flex-row mb-10 gap-2 mx-auto">
        {code.map((_, index) => (
          <TextInput
            className="w-12 h-12 rounded-lg border-slate-700 text-center text-xl border"
            key={index}
            keyboardType="number-pad"
            maxLength={1}
            onChangeText={(val) => handleInput(val, index)}
            value={code[index]}
            ref={inputRef.current[index]}
            autoFocus={index === 0}
          />
        ))}
      </View>

      <TouchableOpacity
        className="rounded-lg bg-rose-500 p-4"
        onPress={handleSubmit}
      >
        {buttonSpinner ? (
          <ActivityIndicator size="small" color={"white"} />
        ) : (
          <Text className="text-white text-center text-base font-bold">
            Submit
          </Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}
