import React, { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import SpinnerButtonLoader from "../../../loader/SpinnerButtonLoader";

const BkashPayment = (props) => {
  const { confirmOrder } = props;
  const [accept, setAccept] = useState(false);

  const confirmNagadPayment = (e) => {
    if (!accept) {
      Swal.fire({
        text: "Please accept terms and conditions!",
        icon: "warning",
        confirmButtonText: "Ok, Understood",
      });
    } else {
      props.paymentConfirm(e);
    }
  };

  return (
    <div>
      <div>
        <p>
          Please Note <br />
          1. You have an activated bKash account <br />
          2. Ensure you have sufficient balance in your bKash account to cover
          the total cost of the order <br />
          3. Ensure you are able to receive your OTP (one-time-password) on your
          mobile and have bKash PIN
        </p>

        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id="accept"
            checked={accept}
            onChange={() => setAccept(!accept)}
          />
          <label className="form-check-label" htmlFor="accept">
            <p className="m-0">
              I have read and agree, the website
              <Link className="ml-2" to="/pages/terms-and-conditions">
                Terms & Conditions
              </Link>
              ,
              <Link className="mx-2" to="/pages/prohibited-items">
                Prohibited Items
              </Link>
              and
              <Link className="ml-2" to="/pages/return-and-refund-policy">
                Refund & Refund Policy
              </Link>
            </p>
          </label>
        </div>
      </div>
      {confirmOrder?.isLoading ? (
        <SpinnerButtonLoader buttonClass="btn btn-block btn-default py-2 mt-3" />
      ) : (
        <button
          type="button"
          onClick={(e) => confirmNagadPayment(e)}
          className="btn btn-block btn-default py-2 mt-3"
        >
          Pay Now
        </button>
      )}
    </div>
  );
};

export default BkashPayment;
