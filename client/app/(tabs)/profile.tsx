import { View, Text, Image, TextInput, TouchableOpacity } from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router, useNavigation } from "expo-router";
import Loader from "@/components/Loader";
import { Toast } from "react-native-toast-notifications";
import http, { ApiResponse } from "@/utils/http";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import * as ImagePicker from "expo-image-picker";
import useStore from "@/utils/store";

export default function profile() {
  const { loading, user, setUser } = useStore();
  const [info, setInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [isEdit, setIsEdit] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    if (user) {
      setInfo({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });
    }
  }, [user]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity className=" mr-5" onPress={() => setIsEdit(true)}>
          <AntDesign name="edit" size={26} color="green" />
        </TouchableOpacity>
      ),

      headerLeft: () => (
        <Text className="self-start text-2xl font-OutfitMedium ml-5">
          Your Profile
        </Text>
      ),
    });
  }, []);

  const editAvatar = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.75,
      base64: true,
    });

    if (!result.canceled) {
      const base64 = `data:image/png;base64,${result.assets[0].base64}`;

      try {
        const res: ApiResponse = await http.put("/update-user-avatar", {
          avatar: base64,
        });
        if (res.success) {
          setUser(res.data);
          Toast.show(res.message, { type: "success" });
        }
      } catch (error) {
        Toast.show(error as string, { type: "danger" });
      }
    }
  };

  const updateInfo = async () => {
    setIsEdit(false);
    try {
      const res: ApiResponse = await http.put("/update-user-info", {
        firstName: info.firstName,
        lastName: info.lastName,
        email: info.email,
      });

      if (res.success) {
        const data = res.data;
        setUser(data);
        Toast.show(res.message, { type: "success" });
      }
    } catch (error) {
      Toast.show(error as string, { type: "danger" });
    }
  };

  const logout = async () => {
    try {
      const res: ApiResponse = await http.get("/logout");

      if (res.success) {
        setUser(null);
      }
    } catch (error) {
      Toast.show(error as string, { type: "danger" });
    }
  };
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <SafeAreaView className="flex-1">
          {user ? (
            <View className="items-center flex-1 px-5 mt-16 space-y-3">
              <View className="bg-white shadow-md rounded-2xl w-full items-center p-5 justify-center">
                <View className="relative mt-5 w-full items-center">
                  <Image
                    source={{
                      uri:
                        user.avatar?.url ||
                        "https://res.cloudinary.com/dluljgxq4/image/upload/v1726845546/samples/animals/cat.jpg",
                    }}
                    className="w-32 h-32 rounded-full bg-white shadow-md"
                  />

                  <TouchableOpacity
                    onPress={editAvatar}
                    className="absolute bottom-[1px] left-[180px] bg-white rounded-full p-1"
                  >
                    <AntDesign name="picture" size={20} color="green" />
                  </TouchableOpacity>
                </View>

                <View className="items-center mt-5 w-full">
                  {!isEdit && (
                    <View className="space-y-2 items-center">
                      <View className="flex-row space-x-2">
                        <Text className="font-OutfitMedium text-xl">
                          {info.firstName}
                        </Text>
                        <Text className="font-OutfitMedium text-xl">
                          {info.lastName}
                        </Text>
                      </View>
                      <Text className="font-OutfitMedium text-base mr-2">
                        {info.email}
                      </Text>
                    </View>
                  )}

                  {isEdit && (
                    <View className="bg-white rounded-xl w-[85%] pb-3 pt-1 relative">
                      <View className="flex-row self-center border-b-[1px] border-slate-200">
                        <TextInput
                          className="px-6 py-4 text-right flex-1 font-OutfitRegular text-xl focus:text-rose-500"
                          value={info.firstName}
                          autoFocus
                          onChangeText={(val) =>
                            setInfo({ ...info, firstName: val })
                          }
                        />
                        <TextInput
                          className="px-6 py-4 text-left flex-1 font-OutfitRegular text-xl focus:text-rose-500"
                          value={info.lastName}
                          onChangeText={(val) =>
                            setInfo({ ...info, lastName: val })
                          }
                        />
                      </View>
                      <TextInput
                        className="px-4 py-2 text-center font-OutfitRegular text-xl mt-2 focus:text-rose-500"
                        value={info.email}
                        onChangeText={(val) => setInfo({ ...info, email: val })}
                      />

                      <TouchableOpacity
                        className="mr-5 absolute -bottom-2 -right-8 "
                        onPress={updateInfo}
                      >
                        <AntDesign name="check" size={36} color="green" />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>

              <View className=" w-full flex-row space-x-3">
                <TouchableOpacity
                  className="bg-white shadow-md rounded-2xl items-center py-8 px-5 justify-center flex-1 flex-row space-x-2"
                  onPress={() => {
                    router.push("/(routes)/my-address");
                  }}
                >
                  <Text className="font-OutfitRegular text-base tracking-wider">
                    My Address
                  </Text>
                  <FontAwesome name="address-card-o" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-white shadow-md rounded-2xl items-center py-8 px-5 justify-center flex-1 flex-row space-x-2"
                  onPress={() => {
                    router.push("/(routes)/my-order");
                  }}
                >
                  <Text className="font-OutfitRegular text-base tracking-wider">
                    My Order
                  </Text>
                  <FontAwesome name="angellist" size={24} color="black" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={logout}>
                <Text className="text-red-500 text-base font-bold tracking-wider underline ">
                  Log out
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="flex-1 items-center justify-center">
              <TouchableOpacity
                onPress={() => {
                  router.push("/(routes)/login");
                }}
              >
                <Text className="font-OutfitBold text-2xl underline">
                  Log in
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </SafeAreaView>
      )}
    </>
  );
}
