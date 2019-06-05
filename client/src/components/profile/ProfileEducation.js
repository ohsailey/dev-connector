import React from "react";
import Moment from "react-moment";
import PropTypes from "prop-types";

const ProfileEducation = ({
  education: { school, degree, fieldofstudy, current, from, to, description }
}) => (
  <div>
    <h3 className="text-dark">{school}</h3>
    <Moment format="YYYY/MM/DD">{from}</Moment> -{" "}
    {current ? "Now" : <Moment format="YYYY/MM/DD">{to}</Moment>}
    <p>
      <strong>Degree: </strong> {degree}
    </p>
    <p>
      <strong>Field Of Study: </strong> {fieldofstudy}
    </p>
    <p>
      <strong>Description: </strong> {description}
    </p>
  </div>
);

ProfileEducation.propTypes = {
  education: PropTypes.object.isRequired
};

export default ProfileEducation;
