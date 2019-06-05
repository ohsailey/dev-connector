import React, { Fragment } from "react";
import { connect } from "react-redux";
import Moment from "react-moment";
import { deleteExperience } from "../../actions/profile";
import PropTypes from "prop-types";

const Experience = ({ experience, deleteExperience }) => (
  <Fragment>
    <h2 className="my-2">Experience Crendentials</h2>
    <table className="table">
      <thead>
        <tr>
          <th>Companys</th>
          <th>Title</th>
          <th>Years</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {experience &&
          experience.map(exp => (
            <tr key={exp._id}>
              <td>{exp.company}</td>
              <td>{exp.title}</td>
              <td>
                <Moment format="YYYY/MM/DD">{exp.from}</Moment>
                {" ~ "}
                {exp.to === null ? (
                  "Now"
                ) : (
                  <Moment format="YYYY/MM/DD">{exp.to}</Moment>
                )}
              </td>
              <td>
                <button
                  className="btn btn-danger"
                  onClick={e => deleteExperience(exp._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  </Fragment>
);

Experience.propTypes = {
  experience: PropTypes.array.isRequired,
  deleteExperience: PropTypes.func.isRequired
};

export default connect(
  null,
  { deleteExperience }
)(Experience);
