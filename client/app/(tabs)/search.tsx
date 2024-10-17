import {
  View,
  Text,
  TextInput,
  FlatList,
  Modal,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";

import ProductCard from "@/components/ProductCard";
import { ProductList } from "@/hooks/useProduct";
import Loader from "@/components/Loader";
import { useLocalSearchParams } from "expo-router";
import CheckBox from "@/components/CheckBox";
import useStore from "@/utils/store";

const SortTypes = [
  {
    label: "Relevant",
    value: "relevant",
  },
  {
    label: "Low to High",
    value: "low-high",
  },
  {
    label: "High to Low",
    value: "high-low",
  },
];

const Filters = [
  {
    name: "category",
    options: [
      { label: "women", value: "women" },
      { label: "men", value: "men" },
      { label: "kids", value: "kids" },
    ],
  },
  {
    name: "subCategory",
    options: [
      { label: "topwear", value: "topwear" },
      { label: "bottomwear", value: "bottomwear" },
      { label: "winterwear", value: "winterwear" },
    ],
  },
];

export default function search() {
  const { productList, loading } = useStore();
  const [filter, setFilter] = useState<{
    category: string[];
    subCategory: string[];
  }>({
    category: [],
    subCategory: [],
  });
  const [search, setSearch] = useState("");
  const [productData, setProductData] = useState<ProductList>([]);
  const timeId = useRef<NodeJS.Timeout | null>(null);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const params = useLocalSearchParams();
  const [sortType, setSortType] = useState(SortTypes[0].value);
  const pickerRef = useRef<Picker<string>>(null);

  useEffect(() => {
    if (params.filter) {
      const data = JSON.parse(params.filter as string);
      setFilter(data);
    } else {
      setFilter({
        category: [],
        subCategory: [],
      });
    }
  }, [params.filter]);

  useEffect(() => {
    let data = productList?.slice();

    // 检查 category 是否变化
    if (filter?.category.length !== 0 || filter?.subCategory.length !== 0) {
      if (filter?.category.length) {
        data = data?.filter((item) =>
          filter.category.includes(item.category.toLowerCase())
        );
      }

      if (filter?.subCategory.length) {
        data = data?.filter((item) =>
          filter.subCategory.includes(item.subCategory.toLowerCase())
        );
      }
    }

    switch (sortType) {
      case "low-high":
        setProductData(data!.sort((a, b) => a.price - b.price));
        break;
      case "high-low":
        setProductData(data!.sort((a, b) => b.price - a.price));
        break;

      default:
        setProductData(
          data!.sort(
            (a, b) => Date.parse(a.updatedAt) - Date.parse(b.updatedAt)
          )
        );
        break;
    }

    if (search) {
      if (timeId.current) clearTimeout(timeId.current);
      timeId.current = setTimeout(() => {
        data = data?.filter((item) =>
          item.name.toLowerCase().includes(search.toLowerCase())
        );
        setProductData(data || []);
      }, 300);
    }

    setProductData(data || []);
  }, [filter, sortType, search, productList]);

  function openSort() {
    if (pickerRef.current) pickerRef.current.focus();
  }

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <SafeAreaView className="px-5 pb-[260px]">
          <Modal
            animationType="slide"
            transparent={true}
            visible={filterModalVisible}
            onRequestClose={() => {
              setFilterModalVisible(!filterModalVisible);
            }}
          >
            <View className="mx-5 my-auto bg-white/95 rounded-md p-5 shadow-md ">
              <View className="">
                <Text className="mb-5 font-OutfitMedium text-lg">
                  Fliter By:
                </Text>

                <View className="flex-row items-center justify-between">
                  {Filters.map((item) => (
                    <View key={item.name}>
                      <Text className="font-OutfitMedium text-xl capitalize">
                        {item.name}
                      </Text>
                      <CheckBox
                        options={item.options}
                        key={item.name}
                        checkedValues={filter[item.name]}
                        onChange={(val) => {
                          setFilter((prev) => {
                            return { ...prev, [item.name]: val };
                          });
                        }}
                      />
                    </View>
                  ))}
                </View>

                <TouchableOpacity
                  className="self-end mt-2"
                  onPress={() => setFilterModalVisible(!filterModalVisible)}
                >
                  <Text className="font-OutfitMedium text-base bg-red-400 px-3 tracking-wide py-1 rounded-2xl text-white">
                    Close
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <View className="w-full h-14 bg-white rounded-2xl flex-row justify-between items-center px-5 shadow-sm">
            <TextInput
              className="rounded-full px-2 py-3 font-OutfitBold text-[15px] flex-1 text-left"
              placeholder="Search your style..."
              value={search}
              onChangeText={(val) => setSearch(val)}
            />
            <Feather name="search" size={24} color="black" />
          </View>

          <View className="my-5 flex-row justify-between items-center">
            <Text className="font-OutfitBold tracking-widest text-lg">
              {productData?.length}+ Items
            </Text>
            <View className="flex-row items-center gap-5">
              <TouchableOpacity
                className="flex-row justify-center items-center gap-2"
                onPress={openSort}
              >
                <FontAwesome5 name="sort" size={24} color="black" />
                <Text className="font-OutfitLight">Sort</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-row justify-center items-center gap-2"
                onPress={() => setFilterModalVisible(!filterModalVisible)}
              >
                <FontAwesome5 name="filter" size={16} color="black" />
                <Text className="font-OutfitLight">Filter</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="hidden">
            <Picker
              ref={pickerRef}
              selectedValue={sortType}
              onValueChange={(itemValue) => setSortType(itemValue)}
            >
              {SortTypes.map((item, index) => (
                <Picker.Item
                  key={index}
                  label={item.label}
                  value={item.value}
                />
              ))}
            </Picker>
          </View>

          <View>
            <FlatList
              showsVerticalScrollIndicator={false}
              numColumns={2}
              columnWrapperStyle={{ flex: 1, justifyContent: "space-between" }}
              data={productData}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <ProductCard key={item._id} item={item} />
              )}
            />
          </View>
        </SafeAreaView>
      )}
    </>
  );
}
