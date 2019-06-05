import React, { Fragment, useEffect } from "react";
import { connect } from "react-redux";
import { getProfiles } from "../../actions/profile";
import ProfileItem from "./ProfileItem";
import Spinner from "../layout/Spinner";
import PropTypes from "prop-types";

const Profiles = ({ profiles, loading, getProfiles }) => {
  useEffect(() => {
    getProfiles();
  }, [getProfiles]);

  return (
    <Fragment>
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <h1 className="large text-primary">Developers</h1>
          <p className="lead">
            <i className="fab fa-connectdevelop" /> Browse and connect with
            developers
          </p>
          <div className="profiles">
            {profiles.length > 0 ? (
              profiles.map(profile => (
                <ProfileItem key={profile._id} profile={profile} />
              ))
            ) : (
              <h4>No profiles found....</h4>
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

Profiles.propTypes = {
  profiles: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  getProfiles: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  profiles: state.profile.others,
  loading: state.profile.loading
});

export default connect(
  mapStateToProps,
  { getProfiles }
)(Profiles);
