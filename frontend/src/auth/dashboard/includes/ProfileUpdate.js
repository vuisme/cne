import React, { useEffect, useState } from "react";
import { useAuthMutation } from "../../../api/Auth";
import SpinnerButtonLoader from "../../../loader/SpinnerButtonLoader";
import Swal from "sweetalert2";

const ProfileUpdate = (props) => {
  const {
    customer: { data: user, isLoading },
    updateProfile: update,
  } = useAuthMutation();

  const { edit, setEdit } = props;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);

  const updateCustomer = (e) => {
    e.preventDefault();
    update
      .mutateAsync({
        name,
        phone,
        email,
        password,
        password_confirmation: confirmPassword,
      })
      .then((res) => {
        if (res?.update === true) {
          Swal.fire({
            text: res?.message,
            icon: "success",
            confirmButtonText: "Ok, Understood",
          });
          setEdit(false);
        } else {
          setErrors(res.errors);
        }
      });
  };

  useEffect(() => {
    if (user?.id) {
      if (user?.name === null) {
        setEdit(true);
      }
      setName(user?.name);
      setPhone(user?.phone);
      setEmail(user?.email);
    }
  }, [user]);

  if (isLoading) {
    return "";
  }

  if (!edit) {
    return "";
  }

  const nameError = errors?.name ? errors.name[0] : null;
  const phoneError = errors?.phone ? errors.phone[0] : null;
  const emailError = errors?.email ? errors.email[0] : null;
  const passwordError = errors?.password ? errors.password[0] : null;

  return (
    <>
      <div className="modal fade show" style={{ display: "block" }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title" id="staticBackdropLabel">
                Update your profile
              </h4>
              <button
                type="button"
                className="close"
                onClick={() => setEdit(false)}
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={(e) => updateCustomer(e)}>
                <div className="form-group">
                  <label htmlFor="name">
                    {" "}
                    Name <span className="text-danger"> * </span>{" "}
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    placeholder="Name"
                    required={true}
                  />
                  {nameError && (
                    <p className="small m-0 text-danger">{nameError}</p>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="otp_code">
                    {" "}
                    Phone <span className="text-danger"> * </span>{" "}
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    autoComplete="off"
                    placeholder="Phone"
                    required={true}
                  />
                  {phoneError && (
                    <p className="small m-0 text-danger">{phoneError}</p>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="email"> Email </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    placeholder="Email"
                  />
                  {emailError && (
                    <p className="small m-0 text-danger">{emailError}</p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="password">
                    {" "}
                    Password <span className="text-danger"> * </span>
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="password"
                    placeholder="Password"
                    required={true}
                  />
                  {passwordError && (
                    <p className="small m-0 text-danger">{passwordError}</p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="password_confirmation">
                    {" "}
                    Confirm Password <span className="text-danger"> * </span>
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password_confirmation"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    required={true}
                  />
                </div>

                <div className="clearfix">
                  <div className="float-left">
                    <button
                      type="button"
                      onClick={() => setEdit(false)}
                      className={`btn py-2 btn-default`}
                    >
                      Skip Now
                    </button>
                  </div>
                  <div className="float-right">
                    {update.isLoading ? (
                      <SpinnerButtonLoader />
                    ) : (
                      <button type="submit" className={`btn py-2 btn-default`}>
                        Update Now
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" />
    </>
  );
};

export default ProfileUpdate;
