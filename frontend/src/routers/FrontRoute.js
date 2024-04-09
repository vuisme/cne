import React from "react";
import {Route} from "react-router-dom";
import FrontendLayout from "../layouts/FrontendLayout";

const FrontRoute = ({component: Component, ...rest}) => {

  return (
    <Route
      {...rest}
      render={(props) =>
        <FrontendLayout>
          <Component {...props} />
        </FrontendLayout>
      }
    />
  );
};


export default FrontRoute;
