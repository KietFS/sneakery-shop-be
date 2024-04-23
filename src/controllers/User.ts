import {
  CreateUserRequest,
  EditUserRequest,
  LoginUserRequest,
  VerifyUserOTPRequest,
} from "../types/User";
import { IUser, User } from "../entities/User";
import express from "express";
import argon2 from "argon2";
import { generateOTP, sendOTPThroughMail } from "../utils";
import { OTP } from "../entities/OTP";
import { ActionResponse, GetListResponse } from "../types/Response";
import jsonwebToken, { JsonWebTokenError } from "jsonwebtoken";

const getUsers = async (req: express.Request, res: GetListResponse<IUser>) => {
  try {
    const users = await User.find();
    const { params } = req;
    const totalRecords = await User.countDocuments();
    res.status(200).json({
      results: users,
      totalRecords: totalRecords,
      success: true,
      code: 200,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, totalRecords: 0, results: [], code: 500 });
  }
};

//basic flow register user
const registerUser = async (req: CreateUserRequest, res: ActionResponse) => {
  try {
    const { phoneNumber, username, password, email, address } = req.body;
    //Validate field
    if (!password || !email || !username) {
      return res.status(400).json({
        success: false,
        code: 400,
        message: "Missing one or more field",
      });
    }
    const filteredUsers = await User.findOne({
      email: email,
    });
    if (!!filteredUsers) {
      return res.status(400).json({
        success: false,
        message: "Email is alrealdy in use",
        code: 400,
      });
    } else {
      //Create a user with isVerifed field is false
      const encryptedPassword = await argon2.hash(password);
      const newUser = new User({
        username: username,
        email: email,
        phoneNumber: phoneNumber,
        password: encryptedPassword,
        address: address || "",
        isVerified: false,
        rewardPoints: 0,
      });
      await newUser.save();
      const generatedOTP = generateOTP();

      const otp = new OTP({
        otp: generatedOTP,
        userId: newUser?.id,
      });
      await otp.save();
      sendOTPThroughMail(
        email,
        "Please verify your OTP",
        `Your OTP is ${generatedOTP}`
      );
      return res.status(200).json({
        success: true,
        message: {
          text: "Register user successfully",
          verifyID: newUser?.id,
        },
        code: 200,
      });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error", code: 500 });
  }
};

//basic flow login user
const loginUser = async (req: LoginUserRequest, res: ActionResponse) => {
  try {
    const { email, password } = req.body;
    const existedUser = await User.findOne({
      email: email,
    });

    if (!!existedUser) {
      const isValidPassword = await argon2.verify(
        existedUser.password,
        password
      );
      if (isValidPassword) {
        const accessToken = jsonwebToken.sign(
          {
            userId: existedUser._id,
            email: existedUser.email,
          },
          `${process.env.ACCESS_TOKEN_SECRET}`,
          { expiresIn: "7d" } // Set the expiration time as needed
        );

        return res.status(200).json({
          code: 200,
          success: true,
          message: {
            text: "Login successfully",
            info: {
              user: {
                username: existedUser?.username,
                email: existedUser?.email,
                phoneNumber: existedUser?.phoneNumber,
              },
              accessToken: accessToken,
            },
          },
        });
      } else {
        return res?.status(400).json({
          code: 400,
          success: false,
          message: "Email or password is incorrect",
        });
      }
    } else {
      return res?.status(400).json({
        code: 400,
        success: false,
        message: "Email or password is incorrect",
      });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, code: 500, message: "Internal Server Error" });
  }
};

//basic flow for verify otp
const verifyUserOTP = async (
  req: VerifyUserOTPRequest,
  res: ActionResponse
) => {
  const { userId } = req.params;
  try {
    const filterUserOTP = await OTP.findOne({
      userId: userId,
    });

    if (!!filterUserOTP) {
      if (req.body.code == filterUserOTP?.otp) {
        await User.updateOne({ _id: userId }, { $set: { isVerified: true } });
        return res.status(200).json({
          code: 200,
          success: true,
          message: "Verification successful",
        });
      } else {
        return res.status(400).json({
          code: 400,
          success: false,
          message: "Your entered OTP is incorrect, please try again",
        });
      }
    } else {
      return res.status(400).json({
        code: 400,
        success: false,
        message: "Cannot find the user need to verify",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      code: 500,
    });
  }
};

//basic flow for edit user
const editUser = async (req: EditUserRequest, res: ActionResponse) => {
  try {
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader.split(" ")?.[1];
    const decodedInfo = await jsonwebToken.decode(token, { complete: true });
    const userInfo = decodedInfo?.payload as any;
    const existedUser = await User.findOne({
      _id: userInfo.userId,
    });
    if (!!existedUser) {
      await User.updateOne(
        { userId: userInfo.userId },
        {
          $set: {
            username: req.body.username,
            phoneNumber: req.body.phoneNumber,
          },
        }
      );

      return res.status(200).json({
        code: 200,
        success: true,
        message: {
          userInfo: {
            ...(existedUser as any)._doc,
            username: req.body.username,
            phoneNumber: req.body.phoneNumber,
          },
          text: "Cập nhật thông tin người dùng thành công",
        },
      });
    } else {
      return res.status(400).json({
        code: 200,
        success: true,
        message: "Không thể tìm thấy người dùng, vui lòng thử lại sau",
      });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, code: 500, message: "Internal Server Error" });
  }
};

export { getUsers, registerUser, loginUser, verifyUserOTP, editUser };
