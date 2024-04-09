import { camelCased, truncate } from "lodash";

/**
 *
 * @param categories
 * @param ParentId
 * @returns {{}|*}
 */
export const find_cat_parent = (categories, ParentId) => {
  if (categories?.length > 0 && ParentId) {
    return categories.find((find) => find.otc_id === ParentId);
  }
  return {};
};

/**
 *
 * @param category
 * @returns {string|*}
 */
export const loadCatImg = (category) => {
  const asset_base_url = process.env.REACT_APP_ASSET_ENDPOINT;
  const picture = category?.picture || null;
  if (picture) {
    return asset_base_url + "/" + picture;
  }
  const IconImageUrl = category?.IconImageUrl || null;
  if (IconImageUrl) {
    return IconImageUrl;
  }
  return asset_base_url + "/assets/img/backend/no-image-300x300.png";
};

export const loadProductImg = (
  product,
  mainPicture = "/assets/img/backend/no-image-300x300.png"
) => {
  const Pictures = product?.Pictures ? JSON.parse(product.Pictures) : [];
  if (Pictures?.length > 0) {
    const firstPicture = Pictures[0];
    if (firstPicture?.Medium) {
      return firstPicture?.Medium?.Url;
    }
  }
  return mainPicture;
};

/**
 *
 * @param slug
 * @returns {*}
 */
export const slugToKey = (slug) => {
  return camelCased(slug);
};

/**
 * @description go to page top
 */
export const goPageTop = () => {
  try {
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  } catch (error) {
    window.scrollTo(0, 0);
  }
};

export const characterLimiter = (string, length = 42, separator = "...") => {
  return truncate(string, {
    length: length,
    separator: separator,
  });
};

export const loadAsset = (path) => {
  const basePath = process.env.REACT_APP_ASSET_ENDPOINT;
  return `${basePath}/${path}`;
};

export const checkIsEmail = (input) => {
  const format = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return !!input.match(format);
};

export const slugToMakeTitle = (slug) => {
  var words = slug.split("_");
  for (var i = 0; i < words.length; i++) {
    var word = words[i];
    words[i] = word.charAt(0).toUpperCase() + word.slice(1);
  }
  return words.join(" ");
};

export const taobaoSellerPositiveScore = (VendorScore) => {
  const percent = (VendorScore / 20) * 100;
  return Math.round(percent);
};

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const collectionSumCalculate = (collection, key) => {
  return collection.reduce((previousValue, currentValue) => {
    return previousValue + Number(currentValue[key]);
  }, 0);
};

export const numParse = (number, floating = 0) => {
  let newNumber = number > 0 ? Number(number) : 0;
  return floating > 0 ? newNumber.toFixed(floating) : 0;
};
