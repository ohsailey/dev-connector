import React from "react";
import Moment from "react-moment";
import PropTypes from "prop-types";

const ProfileExperience = ({
  experience: { company, title, location, current, from, to, description }
}) => (
  <div>
    <h3 className="text-dark">{company}</h3>
    <Moment format="YYYY/MM/DD">{from}</Moment> -{" "}
    {current ? "Now" : <Moment format="YYYY/MM/DD">{to}</Moment>}
    <p>
      <strong>Position: </strong> {title}
    </p>
    <p>
      <strong>Description: </strong>{" "}
    </p>
    <pre className="break-line">{description}</pre>
  </div>
);
ProfileExperience.propTypes = {
  experience: PropTypes.object.isRequired
};

export default ProfileExperience;
