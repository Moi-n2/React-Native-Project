import { View, Text, Image, TouchableOpacity, TextInput } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import Color from "@/constants/Colors";
import useCart, { CartItemType } from "@/hooks/useCart";
import useStore from "@/utils/store";

export default function CartItem({ item }: { item: CartItemType }) {
  const { addToCartApi } = useCart();
  const [count, setCount] = useState<number>(item.quantity || 0);
  const timeId = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (count === item.quantity) return;
    if (timeId.current) clearTimeout(timeId.current);
    timeId.current = setTimeout(() => {
      updateCart();
    }, 300);
  }, [count]);

  const updateCart = async () => {
    const cartData = {
      product: item.product,
      quantity: count,
      size: item.size,
    };
    await addToCartApi(cartData);
  };

  return (
    <View className="py-4 px-2">
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

          <Text className="font-Prata italic font-bold text-base text-red-600 self-end">
            ${item.product?.price}/pc
          </Text>

          <View className="flex-row flex-1 items-center justify-between mb-0">
            <View className="flex-row gap-2 items-center">
              <Text className="font-OutfitMedium text-md">Size:</Text>
              <Text className="text-red-400 rounded-lg px-2 py-0.5 border-red-400 border">
                {item?.size}
              </Text>
            </View>

            <View className="flex-row gap-1 items-center">
              <TouchableOpacity onPress={() => setCount((prev) => prev - 1)}>
                <Feather name="minus-circle" size={22} color={Color.grey} />
              </TouchableOpacity>
              <TextInput
                value={count.toString()}
                onChangeText={(val) => setCount(+val)}
                className="text-center text-lg font-OutfitMedium"
              />
              <TouchableOpacity onPress={() => setCount((prev) => prev + 1)}>
                <Feather name="plus-circle" size={22} color={Color.grey} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      <View className="mt-3 flex-row border-t-[1px] border-slate-200 p-2 justify-between items-center ">
        <Text className="font-OutfitRegular text-base">Total: {count} pc</Text>
        <Text className="font-OutfitRegular text-base">
          ${item.product?.price * count}
        </Text>
      </View>
    </View>
  );
}
