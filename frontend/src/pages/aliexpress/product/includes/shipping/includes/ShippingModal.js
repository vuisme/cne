import React from "react";

const ShippingModal = (props) => {
  const {
    currency,
    freightList,
    shippingRate,
    selectShipping,
    updateDeliveryCharge,
    setOptionEnable,
  } = props;

  const selectShippingOptions = (event, option) => {
    event.preventDefault();
    setOptionEnable(false);
    updateDeliveryCharge(option);
  };

  const closeModal = () => {
    setOptionEnable(false);
  };

  return (
    <>
      <div
        className="modal fade show"
        id="staticBackdrop"
        data-backdrop="static"
        data-keyboard="false"
        style={{ display: "block" }}
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="staticBackdropLabel">
                Choose Your Shipping Option
              </h5>
              <button
                type="button"
                className="close"
                onClick={() => closeModal()}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body p-0">
              <div className="list-group">
                {freightList?.map((freight, key) => (
                  <a
                    href="/select"
                    key={key}
                    onClick={(event) => selectShippingOptions(event, freight)}
                    className="list-group-item list-group-item-action"
					rel="nofollow noreferrer"
                  >
                    <h5 className="mb-1">{`${freight.delivery_company}`}</h5>
                    <div className="d-flex w-100 justify-content-between">
                      <div>
                        <p className="mb-1">
                          Shipping Rate:{" "}
                          {`${currency} ` + shippingRate(freight?.delivery_fee)}
                        </p>
                        <small>{`Estimated duration: ${freight?.delivery_time} Days`}</small>
                      </div>
                      <div>
                        <div className=" m-0 pretty p-default p-round">
                          <input
                            type="checkbox"
                            onChange={(event) =>
                              selectShippingOptions(event, freight)
                            }
                            checked={
                              freight.delivery_company ===
                              selectShipping?.delivery_company
                            }
                            id={freight.delivery_company}
                          />
                          <div className="state">
                            <label htmlFor={freight.delivery_company} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" />
    </>
  );
};

export default ShippingModal;
