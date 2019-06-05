const express = require("express");
const request = require("request");
const mongoose = require("mongoose");
const User = require("../../models/User");
const Profile = require("../../models/Profile");
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator/check");

const router = express.Router();

/**
 * @description get profile form data from request body 取得client端送達過來的個人表單資料
 * @param {object} user 登入的使用者
 * @param {object} body client 送過來表單資料
 */

const getProfileFields = ({ user, body }) => ({
  user: user.id,
  // ...(body.handle && { handle: body.handle }),
  ...(body.company && { company: body.company }),
  ...(body.website && { website: body.website }),
  ...(body.location && { location: body.location }),
  ...(body.status && { status: body.status }),
  ...(body.bio && { bio: body.bio }),
  ...(body.githubUserName && { githubUserName: body.githubUserName }),
  ...(body.skills && {
    skills: body.skills.split(",").map(skill => skill.trim())
  }),
  social: {
    ...(body.youtube && { youtube: body.youtube }),
    ...(body.twitter && { twitter: body.twitter }),
    ...(body.facebook && { facebook: body.facebook }),
    ...(body.linkedin && { linkedin: body.linkedin }),
    ...(body.instagram && { instagram: body.instagram })
  }
});

/**
 * @route         Get /api/profile
 * @description   Get all profiles 取得所有人的個人資訊
 * @access        Public
 */
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

/**
 * @route         Post /api/profile
 * @description   Create or Update profile 建立個人資訊 & 更新個人資訊
 * @access        Private
 */
router.post(
  "/",
  [
    auth,
    [
      check("status", "status is required")
        .not()
        .isEmpty(),
      check("skills", "skills is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const profileFields = getProfileFields(req);

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      // Update 更新個人資訊
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }

      profile = new Profile(profileFields);

      await profile.save();

      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

/**
 * @route         Delete /api/profile
 * @description   Delete profile, user & posts 刪除使用者、個人資訊以及過去發布的貼文
 * @access        Private
 */
router.delete("", auth, async (req, res) => {
  try {
    // First remove profile, then remove user
    await Profile.findOneAndRemove({ user: req.user.id });
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: "User already deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

/**
 * @route         Get /api/profile/me
 * @description   Get logined in user's profile 取得登入使用者個人資訊
 * @access        Private
 */
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    );

    // check if find current user's profile
    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }

    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

/**
 * @route         Get /api/profile/user/:user_id
 * @description   Get Profile by User ID 透過使用者ID取得個人資訊
 * @access        Public
 */
router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate("user", ["name", "avatar"]);

    // valid ObjectId but is wrong user ID
    if (!profile) {
      return res.status(400).json({ msg: "Profile not found" });
    }

    res.json(profile);
  } catch (error) {
    console.error(error.message);

    // invalid model object id 無效的資料object id
    if (error.kind === "ObjectId") {
      return res.status(400).json({ msg: "Profile not found" });
    }

    res.status(500).send("Server Error");
  }
});

/**
 * @route         Put /api/profile/experience
 * @description   Add experience to profile 個人資訊新增工作經驗
 * @access        Private
 */
router.put(
  "/experience",
  [
    auth,
    [
      check("title", "Job title is required")
        .not()
        .isEmpty(),
      check("company", "Company is required")
        .not()
        .isEmpty(),
      check("from", "From Date is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    } = req.body;

    const newExperience = {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.experience.unshift(newExperience);
      await profile.save();

      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

/**
 * @route         Delete /api/profile/experience/:experience_id
 * @description   Remove experience from profile 個人資訊刪除單一工作經驗
 * @access        Private
 */
router.delete("/experience/:experience_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    // remove experience 名單移除工作經驗
    profile.experience = profile.experience.filter(
      exp => exp.id !== req.params.experience_id
    );

    await profile.save();

    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

/**
 * @route         Put /api/profile/education
 * @description   Add education to profile 個人資訊新增學歷
 * @access        Private
 */
router.put(
  "/education",
  [
    auth,
    [
      check("school", "School is required")
        .not()
        .isEmpty(),
      check("degree", "Degree is required")
        .not()
        .isEmpty(),
      check("fieldofstudy", "Field of study is required")
        .not()
        .isEmpty(),
      check("from", "From date is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    } = req.body;

    const newEducation = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.education.unshift(newEducation);
      await profile.save();

      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

/**
 * @route         Delete /api/profile/education/:education_id
 * @description   Remove education from profile 從個人資訊刪除單一學歷
 * @access        Private
 */
router.delete("/education/:education_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    // remove eduction 名單移除學歷
    profile.education = profile.education.filter(
      edu => edu.id !== req.params.education_id
    );
    profile.save();

    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

/**
 * @route         Get /api/profile/github/:username
 * @description   Get user's github repositorys 取得使用者github repos
 * @access        Public
 */
router.get("/github/:username", async (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=10&sort=created&direction=desc`,
      method: "GET",
      headers: { "user-agent": "node.js" }
    };

    request(options, (error, response, body) => {
      if (error) console.error(error);

      if (response.statusCode !== 200) {
        return res.status(404).json({ msg: "No github repository found" });
      }

      res.json(JSON.parse(body));
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
