
import AliAdditionalInformation from "./includes/AliAdditionalInformation";
import AliProductDescription from "./includes/AliProductDescription";
import ShippingAndDelivery from "../../../../product/productSingleNew/includes/ShippingAndDelivery";
import {useState} from "react";

const AliProductDetailsTab = (props) => {
  const {product} = props;
  const [activePage, setActivePage] = useState('additional');

  const activePageChange = (event, page = 'additional') => {
    event.preventDefault();
    setActivePage(page);
  };

  return (
    <div className="product-details-tab">
      <div className="row justify-content-center">
        <div className="col-lg-3 col-md-4 col-12 mb-2">
          <a className={`nav-link btn-block ${activePage === 'additional' && 'active'}`}
             href={`/additional`}
             onClick={event => activePageChange(event, 'additional')}
          >
            Specification
          </a>
        </div>
        <div className="col-lg-3 col-md-4 col-12 mb-2 px-md-0">
          <a className={`nav-link btn-block ${activePage === 'description' && 'active'}`}
             href={`/description`}
             onClick={event => activePageChange(event, 'description')}
          >
            Description
          </a>
        </div>
        <div className="col-lg-3 col-md-4 col-12 mb-2">
          <a className={`nav-link btn-block ${activePage === 'shipping' && 'active'}`}
             href={`/shipping`}
             onClick={event => activePageChange(event, 'shipping')}
          >
            Shipping &amp; Delivery
          </a>
        </div>
      </div>
      <div className="tab-content">
        {activePage === 'additional' && <AliAdditionalInformation product={product}/>}
        {activePage === 'description' && <AliProductDescription product={product}/>}
        {activePage === 'shipping' && <ShippingAndDelivery/>}
      </div>
    </div>
  )
}

export default AliProductDetailsTab
