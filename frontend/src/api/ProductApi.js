import { useMutation, useQuery } from "react-query";
import { instance } from "../utils/AxiosInstance";

export const randomString = () => {
  return [...Array(5)]
    .map((value) => (Math.random() * 1000000).toString(36).replace(".", ""))
    .join("");
};

export const isAuthenticated = () => {
  const isAuthenticated = window.localStorage.getItem("isAuthenticate");
  return isAuthenticated ? JSON.parse(isAuthenticated)?.login : false;
};

export const recent_view_token = () => {
  const recent_view = window.localStorage.getItem("recent_view");
  if (recent_view) {
    return recent_view;
  }
  const token = randomString();
  localStorage.setItem("recent_view", token);
  return token;
};

export const useTabobaoProduct = (itemId) =>
  useQuery(
    ["product", itemId],
    async () => {
      const recent_view = recent_view_token();
      try {
        const { data } = await instance.post(`/product/${itemId}`, {
          recent_view,
        });
        return data?.item ? data?.item : {};
      } catch (error) {
        console.log(error);
      }
    },
    {
      refetchOnMount: false,
    }
  );

export const useProductDetails = (product_id) =>
  useQuery(
    ["ProductDetails", product_id],
    async () => {
      try {
        const { data } = await instance.get(
          `/product-description/${product_id}`
        );
        return data?.description ? data?.description : {};
      } catch (error) {
        console.log(error);
      }
    },
    {
      refetchOnMount: false,
    }
  );

export const useNewArrivedProducts = (page = 1) =>
  useQuery(
    ["useNewArrivedProducts", page],
    async () => {
      try {
        const { data } = await instance.get(`new-arrived-products`, {
          params: { page },
        });
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    {
      refetchOnMount: false,
    }
  );

export const useFavoriteProducts = (page = 1) =>
  useQuery(
    ["useFavoriteProducts", page],
    async () => {
      try {
        const { data } = await instance.get(`favorite-products`, {
          params: { page, limit: 15 },
        });
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    {
      refetchOnMount: false,
    }
  );

export const useRecentViewProducts = (page = 1) =>
  useQuery(
    ["useRecentViewProducts", page],
    async () => {
      const recent_view = recent_view_token();
      try {
        const { data } = await instance.get(`recent-view-products`, {
          params: { recent_view, page },
        });
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    {
      refetchOnMount: false,
    }
  );

export const useSectionProducts = (section) =>
  useQuery(
    ["section", section],
    async () => {
      try {
        const { data } = await instance.get(`get-section-products`, {
          params: { section },
        });
        return data?.products ? JSON.parse(data?.products)?.Content : [];
      } catch (error) {
        console.log(error);
      }
    },
    {
      refetchOnMount: false,
    }
  );

export const useRelatedProducts = (item_id) =>
  useQuery(["relatedProducts"], async () => {
    try {
      const { data } = await instance.post(`related-products/${item_id}`);
      return data?.relatedProducts ? JSON.parse(data?.relatedProducts) : [];
    } catch (error) {
      console.log(error);
    }
  });

export const useCategoryProducts = (slugKey, page = 1) =>
  useQuery(
    ["search", slugKey, page],
    async () => {
      try {
        const { data } = await instance.post(`category-products/${slugKey}`, {
          slugKey,
          page,
        });
        return data?.products ? JSON.parse(data?.products) : {};
      } catch (error) {
        throw Error(error.response.statusText);
      }
    },
    {
      refetchOnMount: false,
    }
  );

export const useSearchKeyword = (keyword, page = 1) =>
  useQuery(
    ["search", keyword, page],
    async () => {
      try {
        const { data } = await instance.get(
          `search?keyword=${keyword}&page=${page}`
        );
        return data?.products ? JSON.parse(data?.products) : {};
      } catch (error) {
        throw Error(error.response.statusText);
      }
    },
    {
      refetchOnMount: false,
    }
  );

export const useSearchSuggestion = (keyword) =>
  useQuery(["SearchSuggestion", keyword], async () => {
    try {
      const { data } = await instance.post(`search/suggestion`, { keyword });
      return data?.suggestion ? data?.suggestion : [];
    } catch (error) {
      throw Error(error.response.statusText);
    }
  });

export const useSearchPictureUpload = () =>
  useMutation(["search-picture"], async (props) => {
    try {
      const { data } = await instance.post(`search-picture`, props);
      return data;
    } catch (error) {
      throw Error(error.response.statusText);
    }
  });

export const usePictureSearch = (search_id, page = 1) =>
  useQuery(
    ["picture", search_id, page],
    async () => {
      try {
        const { data } = await instance.get(`get-picture-result/${search_id}`, {
          params: { page },
        });
        return data?.products ? JSON.parse(data?.products) : {};
      } catch (error) {
        throw Error(error.response.statusText);
      }
    },
    {
      refetchOnMount: false,
    }
  );

export const useTaobaoSellerProducts = (seller_id, page = 1) =>
  useQuery(
    ["useTaobaoSellerProducts", seller_id, page],
    async () => {
      try {
        const { data } = await instance.post(`/vendor-items`, {
          seller_id,
          page,
        });
        return data?.result ? JSON.parse(data?.result) : [];
      } catch (error) {
        console.log(error);
      }
    },
    {
      refetchOnMount: false,
    }
  );

export const useTaobaoSellerInfo = (seller_id) =>
  useQuery(
    ["useTaobaoSellerInfo", seller_id],
    async () => {
      try {
        const { data } = await instance.get(
          `/product-seller-information/${seller_id}`
        );
        return data?.result ? data?.result : [];
      } catch (error) {
        console.log(error);
      }
    },
    {
      refetchOnMount: false,
    }
  );
