import React from "react";
import Intro from "./includes/intro/Intro";
import ProductsLoving from "./includes/Products/productsLoving/ProductsLoving";
// import AliExpressSearchBar from './includes/searchBar/AliExpressSearchBar';

import {useSettings} from "../../api/GeneralApi";
import SectionsProducts from "./sections/SectionsProducts";
import RecentProduct from "./includes/Products/recentProduct/RecentProduct";
import NewArriveProduct from "./includes/Products/NewArriveProduct/NewArriveProduct";

const Home = () => {

   const {data: settings} = useSettings();

   const section_one_active = settings?.section_one_active;
   const section_two_active = settings?.section_two_active;
   const section_three_active = settings?.section_three_active;
   const section_four_active = settings?.section_four_active;
   const section_five_active = settings?.section_five_active;

   return (
      <main className="main" style={{backgroundColor: "#fafafa"}}>
         <Intro settings={settings}/>
         {/* <AliExpressSearchBar/> */}
         {/* <IconBoxes/> */}
         {/*<PopularCategory/>*/}

         {section_one_active === "enable" && (
            <SectionsProducts settings={settings} section={'section_one'}/>
         )}
         {section_two_active === "enable" && (
            <SectionsProducts settings={settings} section={'section_two'}/>
         )}
         {section_three_active === "enable" && (
            <SectionsProducts settings={settings} section={'section_three'}/>
         )}
         {section_four_active === "enable" && (
            <SectionsProducts settings={settings} section={'section_four'}/>
         )}
         {section_five_active === "enable" && (
            <SectionsProducts settings={settings} section={'section_five'}/>
         )}

         <ProductsLoving/>

         <NewArriveProduct/>

         <RecentProduct/>
         {/*<BrandProduct/>*/}
         {/*<Blog/>*/}
      </main>
   );
};


export default Home;
