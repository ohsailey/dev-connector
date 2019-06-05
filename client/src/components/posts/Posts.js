import React, { Fragment, useEffect } from "react";
import { connect } from "react-redux";
import PostItem from "./PostItem";
import PostForm from "./PostForm";
import Spinner from "../layout/Spinner";
import { getPosts } from "../../actions/post";
import PropTypes from "prop-types";

const Posts = ({ posts, loading, getPosts }) => {
  useEffect(() => {
    getPosts();
  }, getPosts);
  return loading ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className="large text-primary">Posts</h1>
      <p className="lead">
        <i className="fas fa-user" /> Welcome to the community
      </p>

      <PostForm />
      <div className="posts">
        {posts.map(post => (
          <PostItem key={post._id} post={post} />
        ))}
      </div>
    </Fragment>
  );
};

Posts.propTypes = {
  posts: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  getPosts: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  posts: state.post.items,
  loading: state.post.loading
});

export default connect(
  mapStateToProps,
  { getPosts }
)(Posts);
