import React from "react";
import { Route, Redirect } from "react-router-dom";

const ProtectedRoute = ({ component: Component, ...props }) => {
  return (
    <Route>
      {() =>
        props.hasPermission ? (
          <Component {...props} />
        ) : (
          <Redirect to={props.redirectTo} />
        )
      }
    </Route>
  );
};

export default ProtectedRoute;
