import React from 'react';

const AttrConfigs = (props) => {
   const {attributes} = props;
   const parseAttributes = attributes ? JSON.parse(attributes) : [];

   return (
      <>
         {
            parseAttributes?.map((attribute, index) =>
               <div key={index} className="checkout-attribute d-inline-block mr-2">
                  <span>{` ${(attribute.ValueAlias || attribute.Value)}`};</span>
               </div>
            )
         }
      </>
   );
};

export default AttrConfigs;