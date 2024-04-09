import React from 'react';
import {NavLink} from "react-router-dom";
// import _ from "lodash";
import {filter_children_cats, filter_parent_cats} from "../../../../utils/Helpers";


export const ParentListItem = (props) => {
   const {parent, categories} = props;

   const allChildren = filter_children_cats(categories, parent.otc_id);

   const children1 = (otc_id) => {
      return filter_children_cats(categories, otc_id);
   };

   if (allChildren.length > 0) {
      return <li key={parent.id}>
         <NavLink to={`/${parent.slug}`}>{parent.name}</NavLink>
         <ul>
            {
               allChildren.map((child1, index) =>
                  <li key={'m_' + index}>
                     {child1.children_count ?
                        <>
                           <NavLink to={`/${parent.slug}/${child1.slug}`}>Contact</NavLink>
                           <ul>
                              {
                                 children1(child1.otc_id).map((child2, index2) =>
                                    <li key={'mc_' + index2}>
                                       <NavLink to={`/${parent.slug}/${child1.slug}/${child2.slug}`}>{child2.name}</NavLink>
                                    </li>
                                 )
                              }
                           </ul>
                        </>
                        :
                        <NavLink to={`/${parent.slug}/${child1.slug}`}>{child1.name}</NavLink>}
                  </li>
               )
            }
         </ul>
      </li>
   }

   return <li>
      <NavLink className="mobile-cats-lead" to={`/shop/${parent.slug}`}>
         {parent.name}
      </NavLink>
   </li>

};


const MobileCategoryList = (props) => {
   const {categories} = props;

   const parents = filter_parent_cats(categories);


   return (
      <nav className="mobile-nav">
         <ul className="mobile-menu">
            {
               parents.length > 0 &&
               parents.map((parent, index) => <ParentListItem key={"pm_" + index} parent={parent} categories={categories}/>)
            }
         </ul>
      </nav>
   );
};

export default MobileCategoryList;