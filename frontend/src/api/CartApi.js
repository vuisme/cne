import { useMutation, useQuery, useQueryClient } from "react-query";
import { instance } from "../utils/AxiosInstance";

export const setGetToken = (token = null) => {
  let token_key = token;
  if (token) {
    window.localStorage.setItem("cart_token", token);
  } else {
    token_key = window.localStorage.getItem("cart_token");
  }
  return token_key;
};

export const useCartMutation = () => {
  const cache = useQueryClient();
  const mainCart = useQuery("customer_cart", async () => {
    const token = setGetToken();
    try {
      const { data } = await instance.get(`cart?token=${token}`);
      setGetToken(data?.cart?.cart_uid);
      return data?.cart ? data?.cart : {};
    } catch (error) {
      console.log(error);
    }
  });

  const updateCart = useMutation(
    ["updateCart"],
    async (props) => {
      const token = setGetToken();
      try {
        const { data } = await instance.post(`/cart/update`, {
          token: token,
          ...props,
        });
        return data?.cart ? data.cart : {};
      } catch (error) {
        console.log(error);
      }
    },
    {
      onMutate: async (newData) => {
        const { item_id, variation_id, qty } = newData;
        await cache.cancelQueries("customer_cart");
        const previousCart = cache.getQueryData("customer_cart");
        cache.setQueryData("customer_cart", (oldCart) => {
          let items = oldCart?.cart_items || [];
          items = items.map((item) => {
            let variations = item.variations.map((variation) => {
              if (variation.id === variation_id) {
                variation.qty = qty;
              }
              return variation;
            });
            variations = variations?.filter((filter) => filter.qty > 0);
            return { ...item, variations: variations };
          });
          return { ...oldCart, cart_items: items };
        });
        return { previousCart };
      },
      onError: (err, newTodo, context) => {
        cache.setQueryData("customer_cart", context.previousCart);
      },
      onSettled: (cart) => {
        cache.setQueryData("customer_cart", cart);
        cache.setQueryData("useCheckoutCart", cart);
      },
    }
  );

  const removeCart = useMutation(
    ["removeCart"],
    async (props) => {
      const token = setGetToken();
      try {
        const { data } = await instance.post(`/cart/remove`, {
          token: token,
          ...props,
        });
        return data?.cart ? data.cart : {};
      } catch (error) {
        console.log(error);
      }
    },
    {
      onSuccess: (cart) => {
        cache.setQueryData("useCheckoutCart", cart);
      },
    }
  );

  const PaymentMethod = useMutation(
    ["updatePaymentMethod"],
    async (props) => {
      const token = setGetToken();
      try {
        const { data } = await instance.post(`/cart/payment-method`, {
          token: token,
          ...props,
        });
        return data?.cart ? data.cart : {};
      } catch (error) {
        console.log(error);
      }
    },
    {
      onSuccess: (cart) => {
        cache.setQueryData("customer_cart", cart);
        cache.setQueryData("useCheckoutCart", cart);
      },
    }
  );

  const confirmOrder = useMutation(
    "confirmOrder",
    async (props) => {
      const token = setGetToken();
      try {
        const { data } = await instance.post(`/cart/place-order`, {
          token: token,
          ...props,
        });
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    {
      onSuccess: (cart) => {
        cache.setQueryData("customer_cart", cart);
        cache.setQueryData("useCheckoutCart", cart);
      },
    }
  );

  return {
    mainCart,
    updateCart,
    removeCart,
    PaymentMethod,
    confirmOrder,
  };
};

export const useCart = () =>
  useQuery("customer_cart", async () => {
    const token = setGetToken();
    try {
      const { data } = await instance.get(`cart?token=${token}`);
      setGetToken(data?.cart_token);
      return data?.cart ? data?.cart : {};
    } catch (error) {
      throw Error(error.response.statusText);
    }
  });

export const useAddToCart = () =>
  useMutation("useAddToCart", async (props) => {
    const token = setGetToken();
    try {
      const { data } = await instance.post(`/cart/add`, {
        token: token,
        ...props,
      });
      setGetToken(data?.cart?.cart_uid);
      return data?.cart ? data.cart : {};
    } catch (error) {
      console.log(error);
    }
  });

export const useCheckoutCart = () =>
  useQuery("useCheckoutCart", async () => {
    const token = setGetToken();
    try {
      const { data } = await instance.get(`cart/checkout?token=${token}`);
      setGetToken(data?.cart_token);
      return data?.cart ? data?.cart : {};
    } catch (error) {
      throw Error(error.response.statusText);
    }
  });

export const useItemMarkAsCart = () =>
  useMutation(["useItemMarkAsCart"], async (props) => {
    const token = setGetToken();
    try {
      const { data } = await instance.post(`/cart/mark-as-cart`, {
        token,
        ...props,
      });
      setGetToken(data?.cart?.cart_uid);
      return data?.cart ? data.cart : {};
    } catch (error) {
      console.log(error);
    }
  });

export const useCheckedUnchecked = () =>
  useMutation("useCheckedUnchecked", async (props) => {
    const token = setGetToken();
    try {
      const { data } = await instance.post(`/cart/checkbox`, {
        token: token,
        ...props,
      });
      setGetToken(data?.cart?.cart_uid);
      return data?.cart ? data.cart : {};
    } catch (error) {
      console.log(error);
    }
  });

export const usePopupMessage = () =>
  useMutation(["useReadPopupMessage"], async (props) => {
    const token = setGetToken();
    try {
      const { data } = await instance.post(`/cart/read-popup`, {
        token: token,
        ...props,
      });
      return data?.cart ? data.cart : {};
    } catch (error) {
      console.log(error);
    }
  });

export const useCheckoutUpdate = () =>
  useMutation(["useCheckoutUpdate"], async (props) => {
    const token = setGetToken();
    try {
      const { data } = await instance.post(`/cart/update/checkout`, {
        token: token,
        ...props,
      });
      return data?.cart ? data.cart : {};
    } catch (error) {
      console.log(error);
    }
  });
