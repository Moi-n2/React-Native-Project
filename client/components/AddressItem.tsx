import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import type { AddresswithId } from "@/app/(routes)/my-address";

type Prop = {
  item: AddresswithId;
  onEdit: () => void;
};

export default function AddressItem({ item, onEdit }: Prop) {
  const [address, setAddress] = useState("");
  useEffect(() => {
    if (item) {
      const addressString = Object.entries(item)
        .filter(([key]) => key !== "_id" && key !== "isDefault") // 过滤掉 _id
        .map(([, value]) => value) // 仅获取值
        .join(" ");
      setAddress(addressString);
    }
  }, [item]);
  return (
    <View className=" flex-row justify-between bg-white shadow-md rounded-2xl mx-2 px-3 py-2 mb-2">
      <View className="flex-1 px-2 py-4 relative">
        <Text className="font-OutfitLight text-base">{address}</Text>
        {item.isDefault && (
          <Text className="bg-red-400 text-white px-3 py-1 rounded-full absolute right-2 bottom-0 font-OutfitRegular">
            Default
          </Text>
        )}
      </View>
      <TouchableOpacity className="p-5 " onPress={onEdit}>
        <FontAwesome name="edit" size={22} color="#52525b" />
      </TouchableOpacity>
    </View>
  );
}
