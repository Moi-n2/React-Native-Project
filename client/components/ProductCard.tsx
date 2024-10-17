import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Href, router } from "expo-router";
import { images } from "@/constants";
import { Product } from "@/hooks/useProduct";

export default function ProductCard({ item }: { item: Product }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  return (
    <TouchableOpacity
      onPress={() => {
        router.push(`/(routes)/product/${item._id}` as Href);
      }}
      className="w-[170px] justify-start items-start h-[260px]"
    >
      {!imageLoaded && (
        <Image
          source={images.placeholder}
          className="h-[200px] w-[170px]"
          resizeMode="contain"
        />
      )}
      <Image
        source={{ uri: item.image[0].url }}
        className="h-[200px] w-[170px]"
        resizeMode="contain"
        onLoad={() => setImageLoaded(true)} // 图片加载成功
        onError={() => setImageLoaded(true)} // 图片加载失败
      />
      <Text className="font-OutfitMedium text-sm ">{item.name}</Text>
      <Text className="font-OutfitLight italic">${item.price}</Text>
    </TouchableOpacity>
  );
}
