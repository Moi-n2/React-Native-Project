import http, { ApiResponse } from "@/utils/http";
import useStore from "@/utils/store";
import { Toast } from "react-native-toast-notifications";
import { Product } from "./useProduct";
import { useState } from "react";

type cartData = {
  product: Product | null;
  size: string;
  quantity?: number;
};

export interface CartItemType {
  _id: string;
  price: number;
  size: string;
  quantity: number;
  product: Product;
}

export default function useCart() {
  const [isLoading, setIsloading] = useState(false);
  const { setUser } = useStore();

  const addToCartApi = async (cartData: cartData) => {
    if (!cartData.product || !cartData.size) {
      return;
    }
    try {
      setIsloading(true);
      const res: ApiResponse = await http.post("/cart/update", cartData);

      if (res.success) {
        if (res.data) {
          setUser(res.data);
        }
        Toast.show("Add to cart successfully!", {
          type: "success",
        });
        setIsloading(false);
      }
    } catch (error) {
      Toast.show(error as string, {
        type: "danger",
      });
      //   setError(error as string);
      setIsloading(false);
    }
  };

  return { addToCartApi, isLoading };
}
