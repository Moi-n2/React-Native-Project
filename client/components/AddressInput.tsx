import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Address } from "@/hooks/useAddress";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Color from "@/constants/Colors";

interface AddressInputProps {
  onConfirm: (addressForm: Address) => void; // 定义 onConfirm 接受 Address 类型的参数
  onClose: () => void; // 定义 onConfirm 接受 Address 类型的参数
  isLoading: boolean;
  address?: Address | null;
}

export default function AddressInput({
  onConfirm,
  onClose,
  isLoading,
  address,
}: AddressInputProps) {
  const [form, setForm] = useState<Address>({
    firstName: "",
    lastName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    isDefault: false,
  });

  useEffect(() => {
    if (address) {
      setForm(address);
    }
  }, []);
  return (
    <View className="gap-5 m-auto p-2 shadow-lg rounded-2xl bg-white w-full">
      <Text className="font-OutfitMedium text-2xl">Add Delivery Address:</Text>

      <View className="gap-2 pr-5">
        <View className="flex-row items-center justify-between space-x-1">
          <TextInput
            value={form.firstName}
            placeholder="firstName"
            multiline
            onChangeText={(val: string) => setForm({ ...form, firstName: val })}
            className="border-slate-200 border-[1px] flex-1 font-OutfitLight px-4 py-3 focus:bg-red-50 rounded-xl"
          />
          <TextInput
            value={form.lastName}
            placeholder="lastName"
            multiline
            onChangeText={(val: string) => setForm({ ...form, lastName: val })}
            className="border-slate-200 border-[1px] flex-1 font-OutfitLight px-4 py-3 focus:bg-red-50 rounded-xl"
          />
        </View>
        <View className="flex-row items-center justify-between space-x-1">
          <TextInput
            value={form.phone}
            placeholder="phone"
            multiline
            onChangeText={(val: string) => setForm({ ...form, phone: val })}
            className="border-slate-200 border-[1px] flex-1 font-OutfitLight px-4 py-3 focus:bg-red-50 rounded-xl"
          />
          <TextInput
            value={form.zipCode}
            placeholder="zipCode"
            multiline
            onChangeText={(val: string) => setForm({ ...form, zipCode: val })}
            className="border-slate-200 border-[1px] flex-1 font-OutfitLight px-4 py-3 focus:bg-red-50 rounded-xl"
          />
        </View>
        <View className="flex-row items-center justify-between space-x-1">
          <TextInput
            value={form.street}
            placeholder="street"
            multiline
            onChangeText={(val: string) => setForm({ ...form, street: val })}
            className="border-slate-200 border-[1px] flex-1 font-OutfitLight px-4 py-3 focus:bg-red-50 rounded-xl"
          />
          <TextInput
            value={form.city}
            placeholder="city"
            multiline
            onChangeText={(val: string) => setForm({ ...form, city: val })}
            className="border-slate-200 border-[1px] flex-1 font-OutfitLight px-4 py-3 focus:bg-red-50 rounded-xl"
          />
        </View>
        <View className="flex-row items-center justify-between space-x-1">
          <TextInput
            value={form.state}
            placeholder="state"
            multiline
            onChangeText={(val: string) => setForm({ ...form, state: val })}
            className="border-slate-200 border-[1px] flex-1 font-OutfitLight px-4 py-3 focus:bg-red-50 rounded-xl"
          />
          <TextInput
            value={form.country}
            placeholder="country"
            multiline
            onChangeText={(val: string) => setForm({ ...form, country: val })}
            className="border-slate-200 border-[1px] flex-1 font-OutfitLight px-4 py-3 focus:bg-red-50 rounded-xl"
          />
        </View>
        <TouchableOpacity
          className="flex-row gap-2 items-center self-end"
          onPress={() => {
            setForm({ ...form, isDefault: !form.isDefault });
          }}
        >
          <MaterialIcons
            name={form.isDefault ? "check-box" : "check-box-outline-blank"}
            size={24}
            color={form.isDefault ? Color.primary : "#475569"}
          />
          <Text className="text-base font-OutfitRegular text-center text-slate-600">
            Set as default
          </Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-between items-center px-5 py-2">
        <TouchableOpacity className="self-end" onPress={() => onConfirm(form)}>
          {isLoading ? (
            <ActivityIndicator size="small" color={"white"} />
          ) : (
            <Text className="font-OutfitMedium text-base bg-red-400 px-3 tracking-wide py-1 rounded-2xl text-white">
              Submit
            </Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity className="self-end" onPress={() => onClose()}>
          <Text className="font-OutfitMedium text-base bg-white px-3 tracking-wide py-1 rounded-2xl text-red-400">
            Close
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
