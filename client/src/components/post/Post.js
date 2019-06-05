import React, { Fragment, useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { getPost } from "../../actions/post";
import PostItem from "../posts/PostItem";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";
import Spinner from "../layout/Spinner";
import PropTypes from "prop-types";

const Post = ({ post, loading, getPost, match }) => {
  useEffect(() => {
    getPost(match.params.id);
  }, [getPost]);

  return loading || post === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <Link to="/posts" className="btn">
        Back To Posts
      </Link>
      <PostItem post={post} showActions={false} />
      <CommentForm postID={match.params.id} />
      <div className="comments">
        {post.comments.map(comment => (
          <CommentItem key={comment._id} comment={comment} postID={post._id} />
        ))}
      </div>
    </Fragment>
  );
};

Post.propTypes = {
  post: PropTypes.object,
  loading: PropTypes.bool.isRequired,
  getPost: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  post: state.post.single,
  loading: state.post.loading
});

export default connect(
  mapStateToProps,
  { getPost }
)(Post);
