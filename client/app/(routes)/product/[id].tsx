import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import Swiper from "react-native-swiper";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import AntDesign from "@expo/vector-icons/AntDesign";
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from "react-native-reanimated";
import Loader from "@/components/Loader";
import { images, Reviews } from "@/constants";
import { Toast } from "react-native-toast-notifications";
import useProduct from "@/hooks/useProduct";
import useCart from "@/hooks/useCart";

export default function productDetail() {
  const { productDetail } = useProduct();
  const { addToCartApi, isLoading } = useCart();
  const [imageLoaded, setImageLoaded] = useState(false);

  const [size, setSize] = useState("");
  const [tab, setTab] = useState("description");
  const scrollRef = useAnimatedRef<Animated.ScrollView>();

  const badgeRef = useAnimatedRef<Animated.View>();
  const scrollOffset = useScrollViewOffset(scrollRef);

  const btnAnimatedStyle = useAnimatedStyle(() => {
    if (!scrollOffset.value) {
      return {
        height: 0,
        opacity: 0,
      };
    }
    return {
      height: scrollOffset?.value > 60 ? 106 : 0,
      opacity: scrollOffset?.value > 100 ? 1 : 0,
    };
  });
  const badgeAnimatedStyle = useAnimatedStyle(() => {
    if (!scrollOffset.value) {
      return {
        opacity: 1,
      };
    }
    return {
      opacity: interpolate(scrollOffset?.value, [65, 100], [1, 0]),
    };
  }, []);

  const addToCart = async () => {
    if (isLoading) return;
    if (!size)
      return Toast.show("Please select size!", {
        type: "warning",
      });
    const data = {
      product: productDetail,
      size,
    };
    addToCartApi(data);
  };

  return (
    <>
      <View className="flex-1 px-5">
        <Animated.ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}
          ref={scrollRef}
        >
          <View className="w-full h-[446px] my-5 pt-10 relative ">
            {productDetail?.bestseller && (
              <View className="absolute top-10 right-0 z-30 rotate-45">
                <FontAwesome6 name="crown" size={40} color="orange" />
              </View>
            )}
            {productDetail?.image ? (
              <Swiper
                showsButtons={false}
                dot={
                  <View className="w-[32px] h-[4px] mx-1 rounded-full bg-white" />
                }
                activeDot={
                  <View className="w-[32px] h-[4px] mx-1 bg-red-500 rounded-full" />
                }
              >
                {productDetail?.image?.map((item, index) => (
                  <View key={index}>
                    {!imageLoaded && (
                      <Image
                        source={images.placeholder}
                        className="w-full h-full rounded-3xl"
                        resizeMode="contain"
                      />
                    )}
                    <Image
                      source={{ uri: item.url }}
                      className="w-full h-full rounded-3xl"
                      resizeMode="contain"
                      onLoad={() => setImageLoaded(true)} // 图片加载成功
                      onError={() => setImageLoaded(true)} // 图片加载失败
                    />
                  </View>
                ))}
              </Swiper>
            ) : (
              <View className="w-full h-[446px] my-5 pt-10 relative ">
                <Loader />
              </View>
            )}
          </View>

          <View className="gap-3">
            <Text className="font-OutfitBold text-2xl tracking-wide relative">
              {productDetail?.name}
            </Text>

            <Text className="font-OutFitRegular text-base">
              {productDetail?.description}
            </Text>

            <View className="flex-row justify-between pr-6 items-center ">
              <View className="flex-row gap-3">
                {productDetail?.sizes?.map((item, index) => (
                  <TouchableOpacity key={index} onPress={() => setSize(item)}>
                    <Text
                      className={`text-red-500 px-3 py-1.5 bg-red-10 rounded-lg border-red-500 border text-center font-OutfitMedium text-base ${
                        size === item ? "bg-red-400 text-white" : ""
                      }`}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text className="font-OutfitLight italic text-3xl text-red-500">
                ${productDetail?.price}
              </Text>
            </View>
          </View>

          <View className="mt-5">
            <View className="flex-row bg-rose-100">
              <TouchableOpacity
                className="flex-1"
                onPress={() => setTab("description")}
              >
                <Text
                  className={`text-red-400 text-center text-lg font-bold mr-3 p-4 rounded-lg ${
                    tab === "description" ? "bg-red-400 text-white" : ""
                  }`}
                >
                  Description
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1"
                onPress={() => setTab("reviews")}
              >
                <Text
                  className={`text-red-400 text-center text-lg font-bold mr-3 p-4 rounded-lg ${
                    tab === "reviews" ? "bg-red-400 text-white" : ""
                  }`}
                >
                  Reviews
                </Text>
              </TouchableOpacity>
            </View>

            <View className="px-2 py-5">
              {tab === "description" && (
                <Text className="leading-5">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas
                  incidunt quod in ad eum eos rerum vel recusandae expedita
                  voluptatibus, ut qui asperiores illum ullam saepe ratione nam
                  eligendi error.
                </Text>
              )}
              {tab === "reviews" && (
                <View className="space-y-3">
                  {Reviews.map((item, index) => (
                    <View
                      className="border-slate-200 border py-2 px-4 gap-2"
                      key={index}
                    >
                      <View className="flex-row justify-between items-center">
                        <Text className="font-OutFitBlack">{item.author}</Text>
                        <View className="flex-row">
                          {Array.from({ length: +item.points }).map(
                            (_, index) => (
                              <AntDesign
                                name="star"
                                size={22}
                                color="gold"
                                key={index}
                              />
                            )
                          )}
                        </View>
                      </View>
                      <Text>{item.comments}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        </Animated.ScrollView>

        <Animated.View
          className="absolute bottom-0 mx-5 right-0"
          style={badgeAnimatedStyle}
          ref={badgeRef}
        >
          <TouchableOpacity
            className="rounded-full bg-rose-500 p-4 my-6 flex-row items-center justify-center"
            onPress={addToCart}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={"white"} />
            ) : (
              <View className="-rotate-6">
                <FontAwesome6 name="cart-plus" size={24} color="white" />
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>

        <Animated.View
          className="absolute bottom-0 w-full mx-5"
          style={btnAnimatedStyle}
        >
          <TouchableOpacity
            className="rounded-lg bg-rose-500 p-4 my-6 flex-row items-center justify-center"
            onPress={addToCart}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={"white"} />
            ) : (
              <>
                <Text className="text-white text-center text-lg font-bold mr-3">
                  Add to Cart
                </Text>
                <View className="-rotate-6">
                  <FontAwesome6 name="cart-plus" size={24} color="white" />
                </View>
              </>
            )}
          </TouchableOpacity>
        </Animated.View>
      </View>
    </>
  );
}
