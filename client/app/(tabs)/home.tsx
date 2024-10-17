import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import React, { useEffect } from "react";
import { images } from "@/constants";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import Swiper from "react-native-swiper";
import ProductCard from "@/components/ProductCard";

import useProduct from "@/hooks/useProduct";
import Loader from "@/components/Loader";
import useStore from "@/utils/store";

export default function home() {
  const { fetchProductList } = useProduct();
  const { loading, productList } = useStore();
  const latestProducts = productList?.slice(-5);
  const bestProducts = productList?.slice(0, 6);

  useEffect(() => {
    fetchProductList();
  }, []);

  const filterByCategory = (cat: string, sub: string) => {
    let data = {};
    if (cat) {
      data = {
        category: [cat],
        subCategory: [],
      };
    }
    if (sub) {
      data = {
        category: [],
        subCategory: [sub],
      };
    }
    const filterString = JSON.stringify(data);
    router.push({
      pathname: "/(tabs)/search",
      params: { filter: filterString },
    });
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <ScrollView className="px-5 pb-5 flex-1">
          <View className="flex-row justify-between items-center">
            <Image
              source={images.logo}
              className="w-24 h-24"
              resizeMode="contain"
            />
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/(tabs)/search",
                    params: { filter: "" },
                  })
                }
              >
                <Feather name="search" size={24} color="black" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push("/(tabs)/profile")}>
                <Feather name="user" size={24} color="black" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push("/(tabs)/cart")}>
                <Feather name="shopping-bag" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>

          <View className="w-full h-[250px] -mt-5">
            <Swiper
              showsButtons={false}
              dot={
                <View className="w-[32px] h-[4px] mx-1 rounded-full bg-white" />
              }
              activeDot={
                <View className="w-[32px] h-[4px] mx-1 bg-red-500 rounded-full" />
              }
            >
              <View className="flex-1">
                <Image source={images.hero_1} className="w-full h-[250px]" />
              </View>
              <View className="flex-1">
                <Image source={images.hero_2} className="w-full h-[300px]" />
              </View>
              <View className="flex-1">
                <Image source={images.hero_3} className="w-full h-[250px]" />
              </View>
            </Swiper>
          </View>

          <View className="my-5">
            <Text className="font-OutfitRegular text-lg">All Categories</Text>
            <ScrollView
              className="py-3"
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                alignItems: "center",
                gap: 20,
              }}
            >
              <TouchableOpacity
                className="items-center font-OutfitRegular"
                onPress={() => filterByCategory("women", "")}
              >
                <Image
                  source={images.dress}
                  className="w-20 h-20 rounded-full bg-rose-50"
                  resizeMode="contain"
                />
                <Text>Women</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="items-center font-OutfitRegular"
                onPress={() => filterByCategory("men", "")}
              >
                <Image
                  source={images.suit}
                  className="w-20 h-20 rounded-full bg-rose-50"
                  resizeMode="contain"
                />
                <Text>Men</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="items-center font-OutfitRegular"
                onPress={() => filterByCategory("kids", "")}
              >
                <Image
                  source={images.kids}
                  className="w-20 h-20 rounded-full bg-rose-50"
                  resizeMode="contain"
                />
                <Text>Kids</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="items-center font-OutfitRegular"
                onPress={() => filterByCategory("", "winterwear")}
              >
                <Image
                  source={images.winter}
                  className="w-20 h-20 rounded-full bg-rose-50"
                  resizeMode="contain"
                />
                <Text>Winter</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="items-center font-OutfitRegular"
                onPress={() => filterByCategory("", "topwear")}
              >
                <Image
                  source={images.top}
                  className="w-20 h-20 rounded-full bg-rose-50"
                  resizeMode="contain"
                />
                <Text>Topwear</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="items-center font-OutfitRegular"
                onPress={() => filterByCategory("", "bottomwear")}
              >
                <Image
                  source={images.bottom}
                  className="w-20 h-20 rounded-full bg-rose-50"
                  resizeMode="contain"
                />
                <Text>Bottom</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
          <View>
            <Text className="font-OutfitRegular text-lg">
              Latest Collections
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                alignItems: "center",
                gap: 20,
              }}
            >
              {latestProducts?.map((product) => (
                <ProductCard key={product._id} item={product} />
              ))}
            </ScrollView>
          </View>

          <View className="my-5">
            <Text className="font-OutfitRegular text-lg">Best Sellers</Text>
            <FlatList
              scrollEnabled={false}
              numColumns={2}
              columnWrapperStyle={{ flex: 1, justifyContent: "space-between" }}
              data={bestProducts}
              keyExtractor={(item) => item._id}
              renderItem={({ item, index }) => (
                <ProductCard key={item._id} item={item} />
              )}
            />
          </View>
        </ScrollView>
      )}
    </>
  );
}
