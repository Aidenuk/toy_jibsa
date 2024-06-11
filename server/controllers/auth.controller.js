
import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { username, email, password } = req.body;
  console.log(req.body);

  if (!username || !email || !password) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  try {
    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    // 새로운 사용자 생성 및 DB에 저장
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    console.log(newUser);
    res.status(201).json({ msg: "User has created an account successfully!" });
  } catch (err) {
    console.error("Error during registration:", err);
    if (err.code === 'P2002' && err.meta && err.meta.target === 'User_email_key') {
      res.status(409).json({ msg: "Email is already registered" });
    } else {
      res.status(500).json({ msg: "An error occurred", error: err.message });
    }
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ msg: "Both username and password are required" });
  }

  try {
    // 사용자 존재 여부 확인
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) return res.status(401).json({ msg: "Invalid ID" });

    // 비밀번호 일치 여부 확인
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ msg: "Invalid password" });

    // JWT 토큰 생성 및 쿠키에 저장
    const age = 1000 * 60 * 60 * 24 * 7; // 7일 후 만료
    const token = jwt.sign(
      {
        id: user.id,
        isAdmin: false, //when a user is admin
      },
      process.env.JWT_SECRET,
      { expiresIn: age }
    );

    //사용자의 정보(아이디,이메일)을 저장 비밀번호를 제외
    const {password: userPassword, ...userInfo} = user

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: age,
    }).status(200).json(userInfo);
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ msg: "Failed to login!", error: err.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token").status(200).json({ msg: "Logout successful" });
};
