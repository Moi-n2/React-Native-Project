import { View, Text, FlatList } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import useStore from "@/utils/store";
import { CartItemType } from "@/hooks/useCart";
import OrderItem from "@/components/OrderItem";

type OrderType = {
  cart: CartItemType[];
  _id: string;
  payment: string;
  status: string;
  createdAt: string;
};

const formateTime = (time: string) => {
  const date = new Date(time);
  return date.toLocaleString();
};

const RenderItem = ({ order }: { order: OrderType }) => (
  <View className="bg-white shadow-md rounded-2xl mx-2 px-3 py-2 mb-2">
    <View className="space-y-2">
      <Text className="font-OutfitLight">Order Status: {order.status}</Text>
      <Text className="font-OutfitThin">
        Created at: {formateTime(order.createdAt)}
      </Text>
    </View>
    {order.cart.map((item) => (
      <OrderItem item={item} key={item._id} />
    ))}
  </View>
);

export default function myOrder() {
  const { user } = useStore();
  return (
    <SafeAreaView className="flex-1">
      <FlatList
        showsVerticalScrollIndicator={false}
        data={user?.orders}
        keyExtractor={(item: OrderType) => item._id}
        renderItem={({ item }) => <RenderItem key={item._id} order={item} />}
      />
    </SafeAreaView>
  );
}
