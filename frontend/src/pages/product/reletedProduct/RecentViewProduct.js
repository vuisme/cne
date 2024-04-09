import React from "react";
import {useRecentViewProducts} from "../../../api/ProductApi";
import SectionProductCard from "../card/SectionProductCard";

const RecentViewProduct = (props) => {
   const {currencyIcon} = props;
   const {data, isLoading} = useRecentViewProducts();


   const recentProducts = data?.products ? JSON.parse(data?.products) : [];

   if (!recentProducts?.length) {
      return '';
   }

   return (
      <div className="row row-cols-lg-5 row-cols-md-4 row-cols-sm-3 row-cols-2 ">
         {recentProducts?.map((product, index) =>
            <SectionProductCard key={index} className={'col'} product={product}/>
         )}
      </div>
   );
};

export default RecentViewProduct;
