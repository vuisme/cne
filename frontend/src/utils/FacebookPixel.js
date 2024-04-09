// import ReactPixel, {Data} from 'react-facebook-pixel';
import ReactPixel from 'react-facebook-pixel';

ReactPixel.init('331996835705041', {}, { debug: false, autoConfig: false });
ReactPixel.pageView();
// ReactPixel.fbq('track', 'PageView');


const environment = process.env.REACT_APP_ENVIRONMENT;


export const fbPixelAddToCart = (name, price, category = 'taobao-products') => {
  if (environment !== 'production') {
    return '';
  }
  ReactPixel.fbq('track', 'AddToCart', {
    content_category: category,
    content_name: name,
    currency: 'BDT',
    value: price
  });
};


export const fbPixelPurchase = (name, price, contents) => {
  if (environment !== 'production') {
    return '';
  }
  ReactPixel.fbq("track", "Purchase", {
    // contents: [{id: params.id, name: params.name, quantity: 1}],
    contents: contents,
    content_category: 'product-purchase',
    content_name: name,
    content_type: 'Product',
    delivery_category: 'in_store',
    currency: 'BDT',
    value: price,
  });
};


export const fbPixelSimplePurchase = (price = 1) => {
  if (environment !== 'production') {
    return '';
  }
  ReactPixel.fbq('track', 'Purchase', { currency: "BDT", value: parseInt(price) });
};


export const fbTrackCustom = (label = 'Home Page', customObject = { page: 'home page visit' }) => {
  if (environment !== 'production') {
    return '';
  }
  ReactPixel.track(label, customObject);
};
