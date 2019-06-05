import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../../actions/auth";

import PropTypes from "prop-types";

const Navbar = ({ logout, loading, isAuthenticated }) => {
  const authLinks = (
    <ul>
      <li>
        <Link to="/profiles">
          <i className="fas fa-users" />{" "}
          <span className="hide-sm">Developers</span>
        </Link>
      </li>
      <li>
        <Link to="/posts">
          <i className="far fa-newspaper" />{" "}
          <span className="hide-sm">Posts</span>
        </Link>
      </li>
      <li>
        <Link to="/dashboard">
          <i className="fas fa-user" />{" "}
          <span className="hide-sm">Dashboard</span>
        </Link>
      </li>
      <li>
        <a onClick={logout} href="#!">
          <i className="fas fa-sign-out-alt" />{" "}
          <span className="hide-sm">Logout</span>
        </a>
      </li>
    </ul>
  );

  const guestLinks = (
    <ul>
      <li>
        <Link to="/profiles">
          <i className="fas fa-users" />{" "}
          <span className="hide-sm">Developers</span>
        </Link>
      </li>
      <li>
        <Link to="/register">
          <i className="fas fa-user-plus" />{" "}
          <span className="hide-sm">Register</span>
        </Link>
      </li>
      <li>
        <Link to="/login">
          <i className="fas fa-sign-in-alt" />{" "}
          <span className="hide-sm">Login</span>
        </Link>
      </li>
    </ul>
  );

  return (
    <nav className="navbar bg-dark">
      <h1>
        <Link to="/">
          <i className="fas fa-code" /> DevConnector
        </Link>
      </h1>
      {!loading && (isAuthenticated ? authLinks : guestLinks)}
    </nav>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  isAuthenticated: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  loading: state.auth.loading,
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(
  mapStateToProps,
  { logout }
)(Navbar);
