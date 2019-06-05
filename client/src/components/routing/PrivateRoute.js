import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

// Route which needed authentication to access 需要登入權限才能進去的頁面
const PrivateRoute = ({
  loading,
  isAuthenticated,
  component: Component,
  ...rest
}) => (
  <Route
    {...rest}
    render={props =>
      !loading && !isAuthenticated ? (
        <Redirect to="/login" />
      ) : (
        <Component {...props} />
      )
    }
  />
);
PrivateRoute.propTypes = {
  loading: PropTypes.bool.isRequired,
  isAuthenticated: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  loading: state.auth.loading,
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps)(PrivateRoute);
