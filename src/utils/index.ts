import nodemailer from "nodemailer";
import jsonwebToken from "jsonwebtoken";
import { UserRole } from "../entities/User";
import { NotiBody } from "../types/Notification";
import axios from "axios";

const sendOTPThroughMail = (to, subject, text) => {
  // Thông tin tài khoản email gửi
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_ADDRESS, // Thay bằng địa chỉ email của bạn
      pass: process.env.MAIL_PASSWORD, // Thay bằng mật khẩu của bạn
    },
  });

  // Thông tin email
  const mailOptions = {
    from: "Sneakery Shop", // Thay bằng địa chỉ email của bạn
    to: to,
    subject: subject,
    text: text,
  };

  // Gửi email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

const generateOTP = (): string => {
  const digits = "0123456789";
  let otp = "";

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * digits.length);
    otp += digits.charAt(randomIndex);
  }

  return otp;
};

const decodeBearerToken = async (
  bearerToken: string
): Promise<{ userId: string; role: UserRole; deviceId?: string }> => {
  const token = bearerToken?.split(" ")?.[1];
  const decodedInfo = await jsonwebToken.decode(token, { complete: true });
  const userInfo = decodedInfo?.payload as any;
  if (!!userInfo) {
    return userInfo;
  }
};

const sendNoti = async (userDeviceId: string, body: NotiBody) => {
  try {
    console.log("USER DE", userDeviceId);
    const response = await axios.post(
      `https://fcm.googleapis.com/fcm/send`,
      {
        to: userDeviceId,
        notification: body,
      },
      {
        headers: {
          Authorization: `key=${process.env.CLOUD_MESSAGE_SERVER_ID}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data) {
      console.log("RESPONSE IS", response?.data);
    }
  } catch (error) {
    // console.log("SEND NOTI ERROR", error);
  }
};

export { sendOTPThroughMail, generateOTP, decodeBearerToken, sendNoti };
