import { useMutation, useQuery } from "react-query";
import { apiGet, apiPost, instance } from "../utils/AxiosInstance";


export const setGetRefreshToken = (token = null) => {
  if (token) {
    window.localStorage.setItem("_token", token);
    return token;
  }
  return window.localStorage.getItem("_token");
}

const setGetCategories = (categories = []) => {
  if (categories?.length > 0) {
    window.localStorage.setItem("_categories", JSON.stringify(categories));
    return categories;
  }
  const cats = window.localStorage.getItem("_categories");
  return (typeof cats === 'string') ? JSON.parse(cats) : [];
}

const setGetSettings = (settings = {}) => {
  if (Object.keys(settings)?.length > 0) {
    window.settings = settings;
    return settings;
  }
  const settingsData = window.settings;
  return (typeof settingsData === 'object') ? settingsData : {};
}

const setGetBanners = (banners = {}) => {
  if (Object.keys(banners)?.length > 0) {
    window.localStorage.setItem("_banners", JSON.stringify(banners));
    return banners;
  }
  const bannerData = window.localStorage.getItem("_banners");
  return (typeof bannerData === 'string') ? JSON.parse(bannerData) : {};
}

export const useHome = () => {
  const lovingProducts = useQuery(
    ["loving-products"],
    async () => {
      try {
        const { data } = await instance.post(`loving-products`);
        return data?.products ? JSON.parse(data?.products) : [];
      } catch (error) {
        console.log(error);
      }
    },
    {
      refetchOnMount: false,
    }
  );

  return {
    lovingProducts,
  };
};


export const useBanner = () => useQuery("banners", async () => {
  const _token = setGetRefreshToken();
  const _banner = setGetBanners();
  const { refresh_token, banners } = await apiGet(`banners`, {
    refresh_token: _token,
    has_data: (Object.keys(_banner)?.length > 0)
  });
  if (refresh_token) {
    setGetRefreshToken(refresh_token);
  }
  if (Object.keys(banners)?.length > 0) {
    return setGetBanners(banners);
  }
  return _banner;
});

export const useSettings = () => useQuery("settings", async () => {
  const _token = setGetRefreshToken();
  const _settingData = setGetSettings();
  const { refresh_token, settings } = await apiGet(`general`, {
    refresh_token: _token,
    has_data: (Object.keys(_settingData)?.length > 0)
  });
  if (refresh_token) {
    setGetRefreshToken(refresh_token);
  }
  if (Object.keys(settings)?.length > 0) {
    return setGetSettings(settings);
  }
  return _settingData;
});

export const usePageData = (slug) =>
  useQuery(
    ["pageData", slug],
    async () => {
      try {
        const { data } = await instance.get(`/page/${slug}`);
        return data?.singles ? data?.singles : {};
      } catch (error) {
        console.log(error);
      }
    },
    {
      refetchOnMount: false,
    }
  );

export const useCustomPageData = (url, Key) =>
  useQuery(
    ["customPageData", Key],
    async () => {
      try {
        const { data } = await instance.get(url);
        return data?.[Key] ? data?.[Key] : {};
      } catch (error) {
        console.log(error);
      }
    },
    {
      refetchOnMount: false,
    }
  );


export const useAllCategories = () => useQuery("categories", async () => {
  const _token = setGetRefreshToken();
  const _cats = setGetCategories();
  const { refresh_token, categories } = await apiGet(`categories`, { refresh_token: _token, has_data: (_cats?.length > 0) });
  if (refresh_token) {
    setGetRefreshToken(refresh_token);
  }
  if (categories?.length > 0) {
    return setGetCategories(categories);
  }
  return _cats;
});

export const useContactMessage = () =>
  useMutation("useContactMessage", async (props) => {
    try {
      const { data } = await instance.post(`/contact/message`, props);
      return data;
    } catch (error) {
      throw Error(error.response.statusText);
    }
  });
