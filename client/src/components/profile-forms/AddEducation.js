import React, { Fragment, useState } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { addEducation } from "../../actions/profile";
import PropTypes from "prop-types";

const AddEducation = ({ addEducation, history }) => {
  const [formData, setFormData] = useState({
    school: "",
    degree: "",
    fieldofstudy: "",
    from: "",
    to: "",
    current: false,
    description: ""
  });

  const handleInputChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCheckboxChange = e =>
    setFormData({ ...formData, current: e.target.checked });

  const handleSubmit = e => {
    e.preventDefault();

    addEducation(formData, history);
  };

  return (
    <Fragment>
      <h1 className="large text-primary">Add Your Education</h1>
      <p className="lead">
        <i className="fas fa-graduation-cap" /> Add any school, bootcamp, etc
        that you have attended
      </p>
      <small>* = required field</small>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="* School or Bootcamp"
            name="school"
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="* Degree or Certificate"
            name="degree"
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Field Of Study"
            name="fieldofstudy"
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <h4>From Date</h4>
          <input type="date" name="from" onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <p>
            <input
              type="checkbox"
              name="current"
              onChange={handleCheckboxChange}
            />{" "}
            Current School or Bootcamp
          </p>
        </div>
        <div className="form-group">
          <h4>To Date</h4>
          <input
            type="date"
            name="to"
            disabled={formData.current ? "disabled" : ""}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <textarea
            name="description"
            cols="30"
            rows="5"
            placeholder="Program Description"
            onChange={handleInputChange}
          />
        </div>
        <input type="submit" className="btn btn-primary my-1" />
        <Link className="btn btn-light my-1" to="/dashboard">
          Go Back
        </Link>
      </form>
    </Fragment>
  );
};

AddEducation.propTypes = {
  addEducation: PropTypes.func.isRequired
};

export default connect(
  null,
  { addEducation }
)(withRouter(AddEducation));
