import http, { ApiResponse } from "@/utils/http";
import useStore from "@/utils/store";
import {
  initPaymentSheet,
  presentPaymentSheet,
} from "@stripe/stripe-react-native";
import { useState } from "react";
import { Toast } from "react-native-toast-notifications";

export default function useOrder() {
  const [isLoading, setIsloading] = useState(false);
  const { setUser } = useStore();
  const paymentApi = async (amount: number, address: string) => {
    setIsloading(true);
    try {
      const res: ApiResponse = await http.post("/order/payment", { amount });

      if (res.success) {
        const { client_secret } = res.data;
        const initSheetResponse = await initPaymentSheet({
          merchantDisplayName: "Forever Private Ltd.",
          paymentIntentClientSecret: client_secret,
        });

        if (initSheetResponse.error) {
          console.error(initSheetResponse.error);
          setIsloading(false);
          return;
        }

        const paymentResponse = await presentPaymentSheet();

        if (paymentResponse.error) {
          setIsloading(false);
          Toast.show(paymentResponse.error.message as string, {
            type: "danger",
          });
        } else {
          await createOrder(address);
        }
      }
    } catch (error) {
      setIsloading(false);
      Toast.show(error as string, { type: "danger" });
    }
  };

  const createOrder = async (address: string) => {
    try {
      const res: ApiResponse = await http.post("/order/create-mobile-order", {
        status: "Paid by Stripe",
        address,
      });
      if (res.success) {
        setUser(res.data);
        setIsloading(false);
        Toast.show("Paid successfully!", { type: "success" });
      }
    } catch (error) {
      setIsloading(false);
      Toast.show(error as string, { type: "danger" });
    }
  };

  return { isLoading, paymentApi };
}
