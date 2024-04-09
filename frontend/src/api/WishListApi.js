import { useMutation, useQuery } from "react-query";
import { instance } from "../utils/AxiosInstance";

export const useWishList = (process) =>
  useQuery("wishlist", async () => {
    try {
      const { data } = await instance.post(`wishlist`);
      return data?.wishlists ? data?.wishlists : [];
    } catch (error) {
      console.log(error);
    }
  });

export const useAddToWishList = () =>
  useMutation("addItemToWishList", async (props) => {
    try {
      const { data } = await instance.post(`add-to-wishlist`, props);
      return data;
    } catch (error) {
      console.log(error);
    }
  });

export const useRemoveFromWishList = () =>
  useMutation("useRemoveFromWishList", async (props) => {
    try {
      const { data } = await instance.post(`remove-wishlist`, props);
      return data;
    } catch (error) {
      console.log(error);
    }
  });
