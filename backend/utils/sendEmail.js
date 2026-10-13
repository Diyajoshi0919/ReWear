import nodemailer from "nodemailer";

// Email is optional. If EMAIL_USER / EMAIL_PASS aren't set, emails are skipped
// so the rest of the app still works.
const sendEmail = async (to, subject, text) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });
    await transporter.sendMail({ from: `ReWear <${process.env.EMAIL_USER}>`, to, subject, text });
  } catch (err) {
    // A failed email should never break the request that triggered it
    console.error("Email not sent:", err.message);
  }
};

export default sendEmail;
