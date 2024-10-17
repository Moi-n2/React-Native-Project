import { View, Text, Image } from "react-native";
import React from "react";
import AppIntroSlider from "react-native-app-intro-slider";
import { SafeAreaView } from "react-native-safe-area-context";
import { onboarding } from "@/constants";
import { Href, router } from "expo-router";
import { onboardingSwiperDataType } from "@/types/global";

export default function welcome() {
  return (
    <AppIntroSlider
      renderItem={RenderItem}
      data={onboarding}
      onDone={() => {
        router.push("/(routes)/login" as Href<string | object>);
      }}
      onSkip={() => {
        router.push("/(routes)/login" as Href<string | object>);
      }}
      nextLabel="Next"
      doneLabel="Done"
      showSkipButton={true}
      dotStyle={{ backgroundColor: "rgba(0, 0, 0, .2)" }}
      activeDotStyle={{ backgroundColor: "rgba(255, 255, 255, .9)" }}
    />
  );
}

const RenderItem = ({ item }: { item: onboardingSwiperDataType }) => {
  return (
    <SafeAreaView className="bg-red-400 h-full">
      <Text className="font-Prata text-2xl text-center mt-20 pb-3 text-slate-100 leading-loose">
        {item.title}
      </Text>
      <Image className="mx-auto" source={item.image} />
      <Text className="font-Prata text-lg text-center px-5 py-6 text-slate-100 leading-loose ">
        {item.description}
      </Text>
    </SafeAreaView>
  );
};
