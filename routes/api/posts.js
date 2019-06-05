const express = require("express");
const mongoose = require("mongoose");
const User = require("../../models/User");
const Post = require("../../models/Post");
const auth = require("../../middleware/auth");
const router = express.Router();
const { check, validationResult } = require("express-validator/check");

/**
 * @route         Post api/posts
 * @description   Add post 建立文章
 * @access        Private
 */
router.post(
  "/",
  [
    auth,
    [
      check("text", "text is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const user = await User.findById(req.user.id).select("-password");

      const newPost = new Post({
        user: req.user.id,
        text: req.body.text,
        name: user.name,
        avatar: user.avatar
      });

      await newPost.save();

      res.json(newPost);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

/**
 * @route         Get api/posts
 * @description   Get all posts 取得所有文章
 * @access        Private
 */
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });

    res.json(posts);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

/**
 * @route         Get api/posts/:post_id
 * @description   Get post by ID 取得單一文章
 * @access        Private
 */
router.get("/:post_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    // valid ObjectId but is wrong post ID
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    console.error(error.message);

    // invalid model object id 無效的資料object id
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }

    res.status(500).send("Server Error");
  }
});

/**
 * @route         Delete api/posts/:post_id
 * @description   Delete post by ID 刪除文章
 * @access        Private
 */
router.delete("/:post_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    // valid ObjectId but is wrong post ID
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    // Check user if match
    // ObjectId => String, using method toString
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User is not authorized" });
    }

    await post.remove();

    res.json({ msg: "Post removed" });
  } catch (error) {
    console.error(error.message);

    // invalid model object id 無效的資料object id
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }

    res.status(500).send("Server Error");
  }
});

/**
 * @route         Put api/posts/like:post_id
 * @description   Like a post 文章按讚
 * @access        Private
 */
router.put("/like/:post_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    // valid ObjectId but is wrong post ID
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    // Check if User has already liked the post 檢查此使用者是否已經喜歡此文章
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length > 0
    ) {
      return res.status(400).json({ msg: "Post has been liked" });
    }

    post.likes.unshift({ user: req.user.id });
    await post.save();

    res.json(post.likes);
  } catch (error) {
    console.log(error.message);

    // invalid model object id 無效的資料object id
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).send("Server Error");
  }
});

/**
 * @route         Put api/posts/unlike:post_id
 * @description   Unlike a post 文章取消按讚
 * @access        Private
 */
router.put("/unlike/:post_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    // valid ObjectId but is wrong post ID
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    // Check if User has already liked the post 檢查此使用者是否已經喜歡此文章
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length ===
      0
    ) {
      return res.status(400).json({ msg: "Post has not yet been liked" });
    }

    // remove User from likes 名單移除使用者
    post.likes = post.likes.filter(
      like => like.user.toString() !== req.user.id
    );
    await post.save();

    res.json(post.likes);
  } catch (error) {
    console.log(error.message);

    // invalid model object id 無效的資料object id
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).send("Server Error");
  }
});

/**
 * @route         Post api/posts/comment/:post_id
 * @description   Comment on a post 文章留言
 * @access        Private
 */
router.post(
  "/comment/:post_id",
  [
    auth,
    [
      check("text", "Text is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const user = await User.findById(req.user.id).select("-password");
      const post = await Post.findById(req.params.post_id);

      // valid ObjectId but is wrong post ID
      if (!post) {
        return res.status(404).json({ msg: "Post not found" });
      }

      post.comments.unshift({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      });

      await post.save();

      res.json(post.comments);
    } catch (error) {
      console.error(error);

      // invalid model object id 無效的資料object id
      if (error.kind === "ObjectId") {
        return res.status(404).json({ msg: "Post not found" });
      }

      res.status(500).send("Server Error");
    }
  }
);

/**
 * @route         Delete api/posts/comment/:post_id/:comment_id
 * @description   Delete a comment 刪除留言
 * @access        Private
 */
router.delete("/comment/:post_id/:comment_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    // valid ObjectId but is wrong post ID 找不到文章
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    // find comment by ID 利用ID找到核對的留言
    const comment = post.comments.find(
      comment => comment.id === req.params.comment_id
    );

    // valid ObjectId but is wrong comment ID 找不到留言
    if (!comment) {
      return res.status(404).json({ msg: "Comment does not exist" });
    }

    // Check User 檢查此留言的使用者是否為登入的使用者
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User is not authorized" });
    }

    // remove comment by ID 移除留言
    post.comments = post.comments.filter(
      comment => comment.id !== req.params.comment_id
    );
    await post.save();

    res.json(post.comments);
  } catch (error) {
    console.error(error.message);

    // invalid model object id 無效的資料object id
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }

    res.status(500).send("Server Error");
  }
});

module.exports = router;
