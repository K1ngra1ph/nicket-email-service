import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const secret = req.headers["x-backend-secret"];
  if (!secret || secret !== process.env.BACKEND_SECRET) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const { name, email, phone, eventValue, selectedNumbers, totalValue } = req.body;

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Nicket Events" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Event Registration Confirmation: ${eventValue}`,
      html: `
        <h3>Hi ${name},</h3>
        <p>Thanks for registering for <strong>${eventValue}</strong>.</p>
        <p><strong>Phone:</strong> ${phone}<br/>
           <strong>Selected Numbers:</strong> ${selectedNumbers.join(", ")}<br/>
           <strong>Total:</strong> ₦${Number(totalValue).toLocaleString()}</p>
        <p>See you at the event! — Nicket Team</p>
      `,
    });

    res.json({ message: `Email sent successfully to ${email}` });
  } catch (err) {
    console.error("Email error:", err);
    res.status(500).json({ message: "Failed to send email", error: err.message });
  }
}
