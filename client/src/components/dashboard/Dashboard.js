import React, { Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardActions from "./DashboardActions";
import Experience from "./Experience";
import Education from "./Education";
import Spinner from "../layout/Spinner";
import { connect } from "react-redux";
import { getCurrentProfile, deleteAccount } from "../../actions/profile";
import PropTypes from "prop-types";

const Dashboard = ({
  user,
  profile,
  loading,
  getCurrentProfile,
  deleteAccount
}) => {
  useEffect(() => {
    getCurrentProfile();
  }, [getCurrentProfile]);

  return loading && profile === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className="large text-primary">Dashboard</h1>
      <p className="lead">
        <i className="fas fa-user" /> Welcome {user && user.name}
      </p>
      {profile !== null ? (
        <Fragment>
          <DashboardActions />
          <Experience experience={profile.experience} />
          <Education education={profile.education} />

          <div className="my-2">
            <button className="btn btn-danger" onClick={e => deleteAccount()}>
              <i className="fas fa-user minus" /> Delete Account
            </button>
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <p>You have not yet setup a profile, please add some info</p>
          <Link to="/create-profile" className="btn btn-primary my-1">
            Create Profile
          </Link>
        </Fragment>
      )}
    </Fragment>
  );
};

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  profile: PropTypes.object,
  loading: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  user: state.auth.user,
  profile: state.profile.me,
  loading: state.profile.loading
});

export default connect(
  mapStateToProps,
  { getCurrentProfile, deleteAccount }
)(Dashboard);
