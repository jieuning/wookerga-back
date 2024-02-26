const router = require("express").Router();
const { User } = require("../models/users");
const bcrypt = require("bcrypt");

const hashPassword = async (password) => {
  const saltRounds = 10; // 솔트 라운드 수, 더 높을수록 해시는 더 강력하지만 느려집니다.
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await hashPassword(password);
    const newUser = new User({
      email: email,
      password: hashedPassword,
    });

    // 일치하는 유저가 있는지 찾기
    const findUser = await User.findOne({ email: newUser.email });

    if (findUser) {
      res.status(409).json({ error: "이미 해당 이메일이 존재합니다." });
    } else {
      await newUser.save();
      res.status(201).json(newUser);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "내부 서버 오류" });
  }
});

module.exports = router;
