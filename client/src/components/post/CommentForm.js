import React, { useState } from "react";
import { connect } from "react-redux";
import { addComment } from "../../actions/post";
import PropTypes from "prop-types";

const CommentForm = ({ postID, addComment }) => {
  const [text, setText] = useState("");

  const handleInputChange = e => setText(e.target.value);

  const handleSubmit = e => {
    e.preventDefault();

    addComment(postID, { text });
    setText("");
  };

  return (
    <div className="post-form">
      <div className="bg-primary p">
        <h3>Leave a Comment</h3>
      </div>
      <form className="form my-1" onSubmit={handleSubmit}>
        <textarea
          name="text"
          cols="30"
          rows="5"
          value={text}
          placeholder="Create a comment"
          onChange={handleInputChange}
          required
        />
        <input type="submit" className="btn btn-dark my-1" value="Submit" />
      </form>
    </div>
  );
};

CommentForm.propTypes = {
  postID: PropTypes.string.isRequired,
  addComment: PropTypes.func.isRequired
};

export default connect(
  null,
  { addComment }
)(CommentForm);
