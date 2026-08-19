import { validationResult } from "express-validator";
import { pool } from "../config/db.js";
import { contactOwnerTemplate, contactSenderTemplate, sendEmail } from "../services/emailService.js";

export async function sendContactMessage(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const first = errors.array()[0];
      return res.status(422).json({ message: first?.msg || "Validation failed", errors: errors.array() });
    }
    const { name, email, subject, message } = req.body;
    const timestamp = new Date().toISOString();
    let contactId = null;

    try {
      const [result] = await pool.query(
        `INSERT INTO contact_messages (name, email, subject, message, ip_address, user_agent, created_at)
         VALUES (?, ?, ?, ?, ?, ?, NOW())`,
        [name, email, subject, message, req.ip || "", req.get("user-agent") || ""]
      );
      contactId = result.insertId;
    } catch (dbError) {
      console.warn("Contact message was not saved to MySQL; continuing with email delivery.", dbError.message);
    }

    const ownerEmail = process.env.CONTACT_OWNER_EMAIL || "salmaelazouazi@gmail.com";
    const ownerDelivery = await sendEmail({
      to: ownerEmail,
      replyTo: email,
      subject: `[FilmHub Contact] ${subject}`,
      html: contactOwnerTemplate({ name, email, subject, message, timestamp })
    });
    await sendEmail({
      to: email,
      subject: "FilmHub received your message",
      html: contactSenderTemplate({ name, subject, timestamp })
    });

    res.status(201).json({
      id: contactId,
      delivered: ownerDelivery.delivered,
      provider: ownerDelivery.provider,
      message: "Message has been sent."
    });
  } catch (error) {
    next(error);
  }
}
