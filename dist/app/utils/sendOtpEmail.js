"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const nodemailer_1 = __importDefault(require("nodemailer"));
const path_1 = require("path");
const sendOtpMail = async (email, otp) => {
    try {
        const templatePath = (0, path_1.resolve)(__dirname, "otpVerification.html");
        let html = (0, fs_1.readFileSync)(templatePath, "utf8");
        // Replace the placeholder with the actual OTP
        html = html.replace("{{OTP_CODE}}", otp);
        const transporter = nodemailer_1.default.createTransport({
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
    }
    catch (error) {
        console.error("Error sending OTP email:", error);
    }
};
exports.default = sendOtpMail;
