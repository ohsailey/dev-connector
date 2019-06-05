import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

const Alert = ({ alerts }) =>
  alerts.map(alert => (
    <div key={alert.id} className={`alert alert-${alert.type}`}>
      {alert.msg}
    </div>
  ));

Alert.propTypes = {
  alerts: PropTypes.array.isRequired
};

const mapStateToProps = ({ alerts }) => ({
  alerts
});

export default connect(mapStateToProps)(Alert);
