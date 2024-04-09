import React, {useEffect, useState} from 'react';
import Swal from "sweetalert2";
import SpinnerButtonLoader from "../../../loader/SpinnerButtonLoader";
import {useSaveAddress} from "../../../api/AddressApi";

const AddEditAddressForm = props => {

  const {editAddress, setEdit, setNewAddress, setManageShipping} = props;

  const [Id, setId] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState('');
  const [address, setAddress] = useState('');

  const {isLoading, mutateAsync} = useSaveAddress();

  useEffect(() => {
    if (editAddress?.id) {
      setId(editAddress.id);
      setName(editAddress.name);
      setPhone(editAddress.phone);
      setDistrict(editAddress.city);
      setAddress(editAddress.address);
    }
  }, [editAddress]);


  const cancelAddEditAddress = () => {
    if (Id) {
      setEdit(false);
    } else {
      setNewAddress(false);
    }
  };

  const submitShippingAddress = (e) => {
    e.preventDefault();
    let proceed = true;
    if (!name && !phone && !district && !address) {
      proceed = false;
      Swal.fire({
        text: "Address fields is are required",
        icon: "warning",
        buttons: "Ok, Understood"
      });
    }

    if (proceed) {
      mutateAsync({
        id: Id,
        name: name,
        phone: phone,
        city: district,
        address: address,
      }, {
        onSuccess: () => {
          setManageShipping(false);
          // cache.invalidateQueries("customer_cart");
          cancelAddEditAddress();
        }
      });
    }
  };


  return (
    <form onSubmit={e => submitShippingAddress(e)}>
      <input type="hidden" value={Id}/>
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Your Name"
          required={true}
          className="form-control"/>
      </div>
      <div className="form-group">
        <label htmlFor="phone">Phone</label>
        <input
          type="text"
          id="phone"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          placeholder="Your Phone"
          required={true}
          className="form-control"/>
      </div>

      <div className="form-group">
        <label htmlFor="district">District</label>
        <input
          type="text"
          id="district"
          value={district}
          placeholder="You District"
          required={true}
          onChange={e => setDistrict(e.target.value)}
          className="form-control"/>
      </div>

      <div className="form-group">
        <label htmlFor="address">Full Address</label>
        <input
          type="text"
          id="address"
          value={address}
          onChange={e => setAddress(e.target.value)}
          required={true}
          placeholder="You Address"
          className="form-control"/>
      </div>

      <div className="form-group">
        {
          isLoading ?
            <SpinnerButtonLoader buttonClass="btn-default mr-2" textClass="text-white"/>
            :
            <button type="submit" className="btn btn-default mr-2">
              Save Address
            </button>
        }
        <button
          type="button"
          onClick={() => cancelAddEditAddress()}
          className="btn btn-secondary rounded">
          Back
        </button>
      </div>


    </form>
  );
};

AddEditAddressForm.propTypes = {};

export default AddEditAddressForm;