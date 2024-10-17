import http, { ApiResponse } from "@/utils/http";
import useStore from "@/utils/store";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";

interface Image {
  public_id: string;
  url: string;
}

export interface Product {
  __v?: number;
  _id: string;
  bestseller?: boolean;
  category: string;
  createdAt: string; // ISO 8601 格式的日期字符串
  description: string;
  image: Image[]; // 图片数组
  name: string;
  price: number;
  sizes: string[]; // 尺码数组
  subCategory: string;
  updatedAt: string; // ISO 8601 格式的日期字符串
}
export type ProductList = Product[];

export default function useProduct() {
  const { setLoading, setProductList, productList, setError } = useStore();

  const fetchProductList = async () => {
    try {
      setLoading(true);
      const res: ApiResponse = await http.get("/product/");

      if (res.success) {
        setProductList(res.data);
        setLoading(false);
      }
    } catch (error) {
      setError(error as string);
      setLoading(false);
    }
  };

  const { id } = useLocalSearchParams();
  const [productDetail, setProductDetail] = useState<Product | null>(null);

  useEffect(() => {
    if (id) {
      const product = productList?.find((item) => item._id === id);
      setProductDetail(product || null);
    }
  }, [id, productList]);

  return { fetchProductList, productDetail };
}
