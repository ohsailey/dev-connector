import React, { Fragment, useState } from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { setAlert } from "../../actions/alert";
import { register } from "../../actions/auth";
import PropTypes from "prop-types";

const Register = ({ setAlert, register, loading, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: ""
  });

  const { name, email, password, passwordConfirm } = formData;

  const handleInputChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();

    if (password !== passwordConfirm) {
      setAlert("Passwords does not match", "danger");
    } else {
      register({ name, email, password });
    }
  };

  return (
    !loading &&
    (isAuthenticated ? (
      <Redirect to="/dashboard" />
    ) : (
      <Fragment>
        <h1 className="large text-primary">Sign Up</h1>
        <p className="lead">
          <i className="fas fa-user" /> Create Your Account
        </p>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Name"
              name="name"
              value={name}
              onChange={handleInputChange}
              // required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email Address"
              name="email"
              value={email}
              onChange={handleInputChange}
              // required
            />
            <small className="form-text">
              This site uses Gravatar so if you want a profile image, use a
              Gravatar email
            </small>
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              name="password"
              // minLength="6"
              value={password}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Confirm Password"
              name="passwordConfirm"
              // minLength="6"
              value={passwordConfirm}
              onChange={handleInputChange}
            />
          </div>
          <input type="submit" className="btn btn-primary" value="Register" />
        </form>
        <p className="my-1">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </Fragment>
    ))
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  isAuthenticated: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  loading: state.auth.loading,
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(
  mapStateToProps,
  { setAlert, register }
)(Register);
