import { readFileSync } from "fs";
import nodemailer from "nodemailer";
import { resolve } from "path";

const sendOtpMail = async (email: string, otp: string) => {
  try {
    const templatePath = resolve(__dirname,  "otpVerification.html");

    let html = readFileSync(templatePath, "utf8");

    // Replace the placeholder with the actual OTP
    html = html.replace("{{OTP_CODE}}", otp);

    const transporter = nodemailer.createTransport({
      service: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: "m.abiralam197@gmail.com",
      to: email,
      subject: "Your OTP Verification Code",
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("OTP Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending OTP email:", error);
  }
};

export default sendOtpMail;
