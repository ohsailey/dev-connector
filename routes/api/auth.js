const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const { check, validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

/**
 * @route         Get api/auth
 * @description   Get user data by token
 * @access        Private
 */
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
});

/**
 * @route         Post api/auth
 * @description   Authenticate user & get token 使用者登入取得認證
 * @access        Public
 */
router.post(
  "/",
  [
    check("email", "Please input a valid email").isEmail(),
    check("password", "Password field is required")
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    const { email, password } = req.body;

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findOne({ email });

      // Check user if exist 檢查是否有此使用者
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      // Check password if match 檢查密碼是否正確
      const isMatchPassword = await bcrypt.compare(password, user.password);

      if (!isMatchPassword) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      const payload = {
        user: {
          id: user.id
        }
      };

      // Produce token and response it (產生token & 回傳)
      jwt.sign(
        payload,
        config.get("secretKey"),
        { expiresIn: 36000000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
