type onboardingSwiperDataType = {
  id: number;
  title: string;
  description: string;
  image: any;
};

type BannerDataTypes = {
  bannerImageUrl: any;
};

export type cartProp = {
  _id: string;
  price: number;
  size: string;
  quantity: number;
  product: productProp;
};

export type productProp = {
  name: String;
  description: String;
  price: Number;
  image: Array;
  category: String;
  subCategory: String;
  sizes: Array;
  bestseller: Boolean;
};

interface Avatar {
  public_id: string;
  url: string;
}

interface Filter {
  name: string;
  options: string[];
}
