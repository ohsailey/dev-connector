import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import { deleteComment } from "../../actions/post";
import PropTypes from "prop-types";

const CommentItem = ({
  postID,
  auth,
  comment: { _id, name, avatar, user, text, date },
  deleteComment
}) => (
  <div className="post bg-white p-1 my-1">
    <div>
      <Link to={`/profile/${user}`}>
        <img className="round-img" src={avatar} alt={name} />
        <h4>{name}</h4>
      </Link>
    </div>
    <div>
      <p className="my-1">{text}</p>
      <p className="post-date">
        Posted on <Moment format="YYYY/MM/DD">{date}</Moment>
      </p>
      {!auth.loading && auth.user._id === user && (
        <button
          className="btn btn-danger"
          type="button"
          onClick={e => deleteComment(postID, _id)}
        >
          <i className="fas fa-times" />
        </button>
      )}
    </div>
  </div>
);

CommentItem.propTypes = {
  postID: PropTypes.string.isRequired,
  auth: PropTypes.object.isRequired,
  comment: PropTypes.object.isRequired,
  deleteComment: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { deleteComment }
)(CommentItem);
