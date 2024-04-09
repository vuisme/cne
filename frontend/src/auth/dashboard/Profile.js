import React, { useEffect, useState } from "react";
import { goPageTop } from "../../utils/Helpers";
import PageSkeleton from "../../skeleton/PageSkeleton";
import Breadcrumb from "../../pages/breadcrumb/Breadcrumb";
import { useAuthMutation } from "../../api/Auth";
import ProfileUpdate from "./includes/ProfileUpdate";
import { analyticsPageView } from "../../utils/AnalyticsHelpers";

const Profile = () => {
  const [edit, setEdit] = useState(false);

  const { customer } = useAuthMutation();
  const { data: user, isLoading } = customer;

  useEffect(() => {
    goPageTop();
    analyticsPageView();
  }, []);

  if (isLoading) {
    return <PageSkeleton />;
  }

  return (
    <main className="main bg-gray">
      <div className="page-content">
        <Breadcrumb
          current={"Profile"}
          collections={[{ name: "Dashboard", url: "dashboard" }]}
        />

        {edit && <ProfileUpdate edit={edit} setEdit={setEdit} />}

        <div className="container">
          <div className="row justify-content-center">
            <aside className="col-md-7">
              <div className="card my-3">
                <div className="card-body">
                  <h2>My Profile</h2>
                  <table className="table">
                    <tbody>
                      <tr>
                        <th />
                        <td>
                          {user.avatar_type === "gravatar" ? (
                            <img
                              src={`https://www.gravatar.com/avatar/404`}
                              style={{ width: "4rem" }}
                              alt={user.name}
                            />
                          ) : (
                            <img
                              src={user.avatar_type}
                              style={{ width: "4rem" }}
                              alt={user.name}
                            />
                          )}
                        </td>
                      </tr>

                      <tr>
                        <th>Name:</th>
                        <td>{user.name}</td>
                      </tr>
                      <tr>
                        <th>Phone:</th>
                        <td>{user.phone || "Add Phone"}</td>
                      </tr>
                      <tr>
                        <th>Email:</th>
                        <td>{user.email}</td>
                      </tr>
                    </tbody>
                  </table>

                  <button
                    type="button"
                    onClick={() => setEdit(true)}
                    className="btn btn-default"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;
