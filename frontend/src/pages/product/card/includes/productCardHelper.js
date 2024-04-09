import { getDBAliProductPrice, getDBProductPrice } from "../../../../utils/CartHelpers";



export const imageHeightCalculate = (device) => {
    if (device.isMobileSmall) {
        return 150;
    } else if (device.isMobile) {
        return 180;
    }
    return 210;
}


export const productPageLink = (ProviderType, ItemId) => {
    return ProviderType === 'aliexpress' ? `/aliexpress/product/${ItemId}` : `/product/${ItemId}`;
};

export const productPrice = (product, rate, ali_rate) => {
    const ProviderType = product?.provider_type || product?.ProviderType;
    if (ProviderType === 'aliexpress') {
        return getDBAliProductPrice(product, ali_rate);
    }
    return getDBProductPrice(product, rate);
};