import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import useStore from "@/utils/store";
import useAddress, { Address } from "@/hooks/useAddress";
import AddressInput from "@/components/AddressInput";
import { Toast } from "react-native-toast-notifications";
import { SafeAreaView } from "react-native-safe-area-context";
import AddressItem from "@/components/AddressItem";

export type AddresswithId = Address & { _id: string };

export default function myAddress() {
  const { user } = useStore();
  const { addAddressApi, isLoading } = useAddress();
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedItem, setSelecteItem] = useState<AddresswithId | null>(null);

  const checkAddressForm = (addressForm: Address) => {
    if (!addressForm.firstName && !addressForm.lastName) {
      Toast.show("Receiver's name can not be empty", { type: "warning" });
      return false;
    }
    const requiredFields = ["phone", "street", "city", "state", "country"];

    const emptyField = requiredFields.find((field) => !addressForm[field]);
    if (emptyField) {
      Toast.show(`Please enter ${emptyField}`, { type: "warning" });
      return false;
    }
    return true;
  };

  const updateAddress = async (addressForm: Address) => {
    const result = checkAddressForm(addressForm);
    if (!result) return;
    await addAddressApi(addressForm);
    setAddModalVisible(false);
  };

  const handleEdit = (item: AddresswithId) => {
    setSelecteItem(item);
    setAddModalVisible(true);
  };

  return (
    <SafeAreaView className="flex-1">
      <Modal
        animationType="slide"
        visible={addModalVisible}
        onRequestClose={() => {
          setAddModalVisible(!addModalVisible);
        }}
      >
        <KeyboardAvoidingView
          className="flex-1 bg-red-300"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <AddressInput
            onConfirm={(addressForm: Address) => {
              updateAddress(addressForm);
            }}
            onClose={() => {
              setAddModalVisible(false);
            }}
            isLoading={isLoading}
            address={selectedItem}
          />
        </KeyboardAvoidingView>
      </Modal>

      <View className="flex-1">
        <FlatList
          showsVerticalScrollIndicator={false}
          data={user?.address}
          keyExtractor={(item: AddresswithId) => item._id}
          renderItem={({ item }) => (
            <AddressItem
              key={item._id}
              item={item}
              onEdit={() => handleEdit(item)}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
}
