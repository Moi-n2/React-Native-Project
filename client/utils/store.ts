import { create } from "zustand";
import { User } from "@/hooks/useAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ProductList } from "@/hooks/useProduct";

type Store = {
  user: User | null;
  productList: ProductList | null;
  loading: boolean;
  error: any;
  setError: (error: any) => void;
  setLoading: (loading: boolean) => void;
  setUser: (user: User | null) => void;
  setProductList: (productList: ProductList | null) => void;
  fetchUser: () => void;
  fetchProductList: () => void;
};

const useStore = create<Store>()((set) => ({
  user: null,
  productList: null,
  loading: false,
  error: null,
  setError: (error: any) => set({ error }),
  setLoading: (loading: boolean) => set({ loading }),
  setUser: async (user: User | null) => {
    const userString = JSON.stringify(user);
    await AsyncStorage.setItem("user", userString);
    set({ user });
  },
  setProductList: async (productList: ProductList | null) => {
    const productListString = JSON.stringify(productList);
    await AsyncStorage.setItem("productList", productListString);
    set({ productList });
  },
  fetchProductList: async () => {
    try {
      const productListString = await AsyncStorage.getItem("productList");
      if (productListString) {
        const productList = JSON.parse(productListString);
        set({ productList });
      }
    } catch (error) {
      set({ error: error, loading: false });
    }
  },
  fetchUser: async () => {
    try {
      const userString = await AsyncStorage.getItem("user");

      if (userString) {
        const user = JSON.parse(userString);
        if (user.access_token) {
          set({ user });
        } else {
          set({ user: null });
        }
      }
    } catch (error) {
      set({ error: error, loading: false });
    }
  },
}));

useStore.getState().fetchUser();

export default useStore;
