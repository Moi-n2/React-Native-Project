import http, { ApiResponse } from "@/utils/http";
import useStore from "@/utils/store";
import { useState } from "react";
import { Toast } from "react-native-toast-notifications";

export interface Address {
  firstName: string;
  lastName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  isDefault: boolean;
}

export default function useAddress() {
  const [isLoading, setIsloading] = useState(false);
  const { setUser } = useStore();

  const addAddressApi = async (addressForm: Address) => {
    try {
      const res: ApiResponse = await http.post(
        "/update-user-address",
        addressForm
      );
      if (res.success && res.data) {
        setUser(res.data);
      }
    } catch (error) {
      Toast.show(error as string, { type: "danger" });
    }
  };

  return { addAddressApi, isLoading };
}
