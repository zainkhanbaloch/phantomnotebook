const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");

const JWT_Secret = "zainkhanbaloch@abc.com";

router.post(
  "/createuser",
  [
    body("email").isEmail(),
    body("password").isLength({ min: 5 }),
    body("name").isLength({ min: 3 }),
  ],
  async (req, res) => {
    let success = false;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }

    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        
        res.status(400).json({ msg: "sorry user already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(req.body.password, salt);

      user = await User.create({
        name: req.body.name,
        password: hash,
        email: req.body.email,
      });

      const tokendata = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(tokendata, JWT_Secret);
      success = true;
      res.json({ success, authToken });

    } catch (error) {

      res.status(500).json({ msg: "Sorry! Some Internal Server Error Occured" });
    }


  }
);

router.post(
  "/login",
  [body("email").isEmail(), body("password").exists()],
  async (req, res) => {
    let success = false;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }

    try {
      let user = await User.findOne({ email: req.body.email });
      if (!user) {
        res
          .status(400)
          .json({success, error: "Please Login With Correct Credentials" });
      }

      const { email, password } = req.body;
      const passwordverify = await bcrypt.compare(password, user.password);
      if (!passwordverify) {
        res
          .status(400)
          .json({ success, error: "Please Login With Correct Credentials" });
      }

      const tokendata = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(tokendata, JWT_Secret);
      success = true;
      res.json({success, authToken });

    } catch (error) {

      res
        .status(500)
        .json({ success, msg: "Sorry! Some Internal Server Error Occured" });
    }
  }
);

router.post("/getdetails", fetchuser, async (req, res) => {
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {

    res.status(500).json({ msg: "Sorry! Some Internal Server Error Occured" });
  }
});

module.exports = router;
