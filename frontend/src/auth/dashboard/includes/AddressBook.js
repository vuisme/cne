import React from 'react';
import AddressLists from "../../../pages/checkout/includes/shipping/AddressLists";
// import PropTypes from 'prop-types';

const AddressBook = () => {


   return (
      <div className="card">
         <div className="card-header border border-bottom-0 p-4">
            <h4 className="card-title  d-inline">Address Book</h4>
         </div>
         <div className="card-body border p-4">
            <AddressLists shipHereBtn={false}/>
         </div>
      </div>
   );
};

// MyAccount.propTypes = {
//
// };

export default AddressBook;