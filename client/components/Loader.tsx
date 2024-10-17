import { images } from "@/constants";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, Text, View } from "react-native";
import AnimatedLoader from "react-native-animated-loader";

export default function Loader() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* <Text>loading</Text> */}
      <AnimatedLoader
        visible={true}
        overlayColor="rgba(255,255,255,0.75)"
        source={images.loader}
        animationStyle={{ flex: 1, width: 300, height: 300 }}
        speed={1.5}
      />
      {/* <Image
        source={require("@/assets/animation/Animation.gif")}
        className="w-[250px] h-[250px]"
      /> */}
    </View>
  );
}
