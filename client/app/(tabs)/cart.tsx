import React, { useEffect, useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import CartItem from "@/components/CartItem";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AddressInput from "@/components/AddressInput";
import useStore from "@/utils/store";
import type { CartItemType } from "@/hooks/useCart";
import useAddress, { Address } from "@/hooks/useAddress";
import { Toast } from "react-native-toast-notifications";
import { StripeProvider } from "@stripe/stripe-react-native";
import { STRIPE_PUBLISH_KEY } from "@/constants/env";
import useOrder from "@/hooks/useOrder";

export default function cart() {
  const { user } = useStore();
  const { addAddressApi, isLoading } = useAddress();
  const { isLoading: isPayLoading, paymentApi } = useOrder();

  const cartItems = user?.cart;
  const totalAmount = useMemo(() => {
    if (cartItems?.length) {
      const total = cartItems.reduce((total, item: CartItemType) => {
        // 检查 product 是否存在
        const price = item.product?.price || 0; // 如果 product 为 null，使用 0
        return total + price * item.quantity; // 计算总金额
      }, 0);
      return total;
    } else {
      return 0;
    }
  }, [cartItems]);

  const [address, setAddress] = useState("");

  useEffect(() => {
    const defaultAddress = user?.address.find(
      (item: Address) => item.isDefault
    );
    if (defaultAddress) {
      const addressString = Object.entries(defaultAddress)
        .filter(([key]) => key !== "_id" && key !== "isDefault") // 过滤掉 _id
        .map(([, value]) => value) // 仅获取值
        .join(" ");
      setAddress(addressString);
    }
  }, [user?.address]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);

  const formatedAmount = new Intl.NumberFormat().format(totalAmount);
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

  const addAddress = async (addressForm: Address) => {
    const result = checkAddressForm(addressForm);
    if (!result) return;
    await addAddressApi(addressForm);
    setAddModalVisible(false);
  };

  const handlePayment = () => {
    if (!address)
      return Toast.show(`Please enter delivery address`, { type: "warning" });
    if (user?.cart.length === 0)
      return Toast.show(`Please add some to cart first`, { type: "warning" });
    paymentApi(totalAmount, address);
  };
  return (
    <StripeProvider publishableKey={STRIPE_PUBLISH_KEY}>
      <SafeAreaView className="px-5 space-y-3 mb-30 relative flex-1">
        <Modal
          animationType="slide"
          visible={editModalVisible}
          onRequestClose={() => {
            setEditModalVisible(!editModalVisible);
          }}
        >
          <View className=" mx-10 my-auto  rounded-md p-5 shadow-md">
            <TextInput
              value={address}
              multiline
              onChangeText={(val) => setAddress(val)}
              className="border rounded-2xl font-OutfitLight px-5 py-6 my-5 text-base"
            />

            <TouchableOpacity
              className="self-end"
              onPress={() => setEditModalVisible(!editModalVisible)}
            >
              <Text className="font-OutfitMedium text-base bg-red-400 px-3 tracking-wide py-1 rounded-2xl text-white">
                Confirm
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          visible={addModalVisible}
          onRequestClose={() => {
            setAddModalVisible(!addModalVisible);
          }}
        >
          <KeyboardAvoidingView
            className="flex-1"
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <AddressInput
              onConfirm={(addressForm: Address) => {
                addAddress(addressForm);
              }}
              onClose={() => {
                setAddModalVisible(false);
              }}
              isLoading={isLoading}
            />
          </KeyboardAvoidingView>
        </Modal>

        <View className="bg-white rounded-2xl shadow-md p-2">
          <View className=" flex-row gap-1">
            <Ionicons name="location-outline" size={22} color="black" />
            <Text className="font-OutfitMedium text-base tracking-wide">
              Delivery Address
            </Text>
          </View>
          <View className="mt-3 border-t-[1px] border-slate-200 flex-row justify-between">
            <View className="flex-1 px-2 py-4 relative">
              <Text className="font-OutfitLight">{address}</Text>
              {address && (
                <TouchableOpacity
                  className="absolute top-1 right-1"
                  onPress={() => {
                    setEditModalVisible((prev) => !prev);
                  }}
                >
                  <Ionicons name="create-outline" size={20} color="black" />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity
              className="p-5 w-[2/5] border-l-[1px] border-slate-200"
              onPress={() => {
                setAddModalVisible((prev) => !prev);
              }}
            >
              <Ionicons name="add-circle-outline" size={32} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="bg-white rounded-2xl shadow-md p-5 flex-1 mb-2">
          <Text className="font-OutfitMedium tracking-wide text-base pl-2">
            Shopping List
          </Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="mt-3 border-t-[1px] border-slate-200">
              {cartItems?.map((item: CartItemType) => (
                <CartItem item={item} key={item._id} />
              ))}
            </View>
          </ScrollView>

          <View className="flex-row justify-between items-center mt-5 border-t-[1px] border-slate-200 pt-3 pl-4">
            <Text className="font-OutfitBold text-base">
              $ {formatedAmount}
            </Text>
            <TouchableOpacity onPress={handlePayment}>
              {isPayLoading ? (
                <ActivityIndicator size="small" color={"white"} />
              ) : (
                <Text className="px-6 py-3 text-white bg-red-500 rounded-lg font-OutfitBold tracking-wider text-md ">
                  Proceed to Payment
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </StripeProvider>
  );
}
