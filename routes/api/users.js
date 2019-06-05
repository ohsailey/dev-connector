const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator/check");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

/**
 * @route         Post api/users
 * @description   Register user 使用者註冊
 * @access        Public
 */
router.post(
  "/",
  [
    check("name", "Name field is required")
      .not()
      .isEmpty(),
    check("email", "Please input a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    const { name, email, password } = req.body;

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let user = await User.findOne({ email });

      // Check user if exist 檢查是否有此使用者
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      // get avatar url from email
      const avatar = gravatar.url(email, {
        s: "200", //size
        r: "pg", //rating
        d: "mm" //default avatar if haven't set it
      });

      // create User field prepared to put into database 建立新的使用者, 準備新增置資料庫
      user = new User({
        name,
        email,
        avatar,
        password
      });

      // Encrypt password 密碼加密
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      // 新增至資料庫儲存
      await user.save();

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
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
