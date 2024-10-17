import { View, Text, Image } from "react-native";
import React from "react";
import { CartItemType } from "@/hooks/useCart";

export default function OrderItem({ item }: { item: CartItemType }) {
  return (
    <View className="py-4 px-2 w-full">
      <View className="flex-row gap-3">
        <Image
          source={{ uri: item.product?.image[0].url }}
          className="w-[100px] h-[116px] "
          resizeMode="contain"
        />
        <View className="flex-1">
          <Text className="font-OutfitMedium text-base tracking-wide">
            {item.product?.name}
          </Text>

          <View className="flex-row flex-1 items-center justify-between mb-0">
            <View className="flex-row gap-2 items-center">
              <Text className="font-OutfitMedium text-md">Size:</Text>
              <Text className="text-red-400 rounded-lg px-2 py-0.5 border-red-400 border">
                {item?.size}
              </Text>
            </View>

            <Text className="font-Prata italic font-bold text-base text-red-600 self-end">
              ${item.product?.price}/pc
            </Text>
          </View>
        </View>
      </View>

      <View className="mt-3 flex-row border-t-[1px] border-slate-200 p-2 justify-between items-center ">
        <Text className="font-OutfitRegular text-base">
          Total: {item.quantity} pc
        </Text>
        <Text className="font-OutfitRegular text-base">
          ${item.product?.price * item.quantity}
        </Text>
      </View>
    </View>
  );
}
