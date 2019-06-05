import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import { addLike, removeLike, deletePost } from "../../actions/post";
import PropTypes from "prop-types";

const PostItem = ({
  auth,
  post: { _id, text, user, name, avatar, likes, comments, date },
  addLike,
  removeLike,
  deletePost,
  showActions
}) => {
  return (
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
          Posted on <Moment format="YYYY/MM/DD" />
        </p>
        {showActions && (
          <Fragment>
            <button
              type="button"
              className="btn btn-light"
              onClick={e => addLike(_id)}
            >
              <i className="fas fa-thumbs-up" />{" "}
              {likes.length > 0 && <span>{likes.length}</span>}
            </button>
            <button
              type="button"
              className="btn btn-light"
              onClick={e => removeLike(_id)}
            >
              <i className="fas fa-thumbs-down" />
            </button>
            <Link to={`/posts/${_id}`} className="btn btn-primary">
              Discussion{" "}
              {comments.length > 0 && (
                <span className="comment-count">{comments.length}</span>
              )}
            </Link>
            {!auth.loading && auth.user._id === user && (
              <button
                type="button"
                className="btn btn-danger"
                onClick={e => deletePost(_id)}
              >
                <i className="fas fa-times" />
              </button>
            )}
          </Fragment>
        )}
      </div>
    </div>
  );
};

PostItem.defaultProps = {
  showActions: true
};

PostItem.propTypes = {
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  addLike: PropTypes.func.isRequired,
  showActions: PropTypes.bool.isRequired,
  removeLike: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { addLike, removeLike, deletePost }
)(PostItem);
