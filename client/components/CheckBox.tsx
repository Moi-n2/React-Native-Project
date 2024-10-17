import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import Color from "@/constants/Colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function CheckBox({ options, checkedValues, onChange }) {
  let updatedCheckedValues = [...checkedValues];
  return (
    <View className="py-3 space-y-1 pl-4">
      {options.map((option) => {
        let active = updatedCheckedValues.includes(option.value);
        return (
          <TouchableOpacity
            className="flex-row gap-2 items-center"
            key={option.value}
            onPress={() => {
              if (active) {
                updatedCheckedValues = updatedCheckedValues.filter(
                  (val) => val !== option.value
                );
                return onChange(updatedCheckedValues);
              }
              updatedCheckedValues.push(option.value);
              onChange(updatedCheckedValues);
            }}
          >
            <MaterialIcons
              name={active ? "check-box" : "check-box-outline-blank"}
              size={24}
              color={active ? Color.primary : "black"}
            />
            <Text className="text-lg font-OutfitRegular text-center capitalize">
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
