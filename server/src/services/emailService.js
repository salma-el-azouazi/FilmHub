import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";

let transport;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function envValue(name, fallback = "") {
  return String(process.env[name] || fallback).trim().replace(/^["']|["']$/g, "");
}

function getTransport() {
  if (transport) return transport;
  const ownerEmail = envValue("CONTACT_OWNER_EMAIL", "salmaelazouazi@gmail.com");
  const rawPassword = envValue("SMTP_PASSWORD");
  const password = rawPassword.replace(/\s+/g, "");
  const host = envValue("SMTP_HOST", password ? "smtp.gmail.com" : "");
  const user = envValue("SMTP_USER", password ? ownerEmail : "");
  if (!host || !user || !password) return null;

  transport = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 465),
    secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : true,
    auth: { user, pass: password }
  });
  return transport;
}

function plainFromHtml(html) {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function sendEmail({ to, subject, html, replyTo }) {
  const from = envValue("MAIL_FROM", `FilmHub <${envValue("SMTP_USER", envValue("CONTACT_OWNER_EMAIL", "no-reply@filmhub.test"))}>`);
  const message = { from, to, subject, html, text: plainFromHtml(html), replyTo };
  const smtp = getTransport();

  if (smtp) {
    try {
      await smtp.sendMail(message);
      return { delivered: true, provider: "smtp" };
    } catch (error) {
      console.warn("SMTP delivery failed; writing email to dev-mails instead.", error.message);
    }
  }

  const dir = path.resolve(__dirname, "../../dev-mails");
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `${Date.now()}-${subject.replace(/[^a-z0-9]+/gi, "-").slice(0, 60)}.html`);
  fs.writeFileSync(file, html, "utf8");
  return { delivered: false, provider: "dev-file", file };
}

export function passwordResetTemplate({ name, resetUrl, expiresMinutes }) {
  const safeName = escapeHtml(name || "FilmHub member");
  const safeUrl = escapeHtml(resetUrl);
  return `
    <div style="font-family:Inter,Arial,sans-serif;background:#080a12;color:#f8fafc;padding:28px">
      <div style="max-width:620px;margin:auto;border:1px solid rgba(255,255,255,.14);border-radius:14px;padding:26px;background:#111522">
        <p style="color:#2de2e6;text-transform:uppercase;letter-spacing:.18em;font-size:12px;font-weight:800">FilmHub Security Check</p>
        <h1 style="margin:12px 0 10px;font-size:30px">Is this you?</h1>
        <p>Hello ${safeName},</p>
        <p>FilmHub received a request to reset your password. Confirm below and the new password page will open automatically.</p>
        <p><a href="${safeUrl}" style="display:inline-block;background:#ff355e;color:#fff;padding:12px 18px;border-radius:8px;text-decoration:none;font-weight:800">Yes, this is me</a></p>
        <p style="color:#b8c1d1">This confirmation expires in ${expiresMinutes} minutes and can be used once.</p>
        <p style="color:#b8c1d1">If you did not request this reset, you can ignore this email.</p>
      </div>
    </div>
  `;
}

export function contactOwnerTemplate({ name, email, subject, message, timestamp }) {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message);
  const safeTimestamp = escapeHtml(timestamp);
  return `
    <div style="font-family:Inter,Arial,sans-serif;background:#080a12;color:#f8fafc;padding:28px">
      <div style="max-width:680px;margin:auto;border:1px solid rgba(255,255,255,.14);border-radius:14px;padding:26px;background:#111522">
        <p style="color:#ffd166;text-transform:uppercase;letter-spacing:.18em;font-size:12px;font-weight:800">New FilmHub contact message</p>
        <h1 style="margin:12px 0 10px;font-size:28px">${safeSubject}</h1>
        <p><b>Name:</b> ${safeName}</p>
        <p><b>Gmail:</b> ${safeEmail}</p>
        <p><b>Subject:</b> ${safeSubject}</p>
        <p><b>Sent:</b> ${safeTimestamp}</p>
        <p style="margin:18px 0 8px"><b>Message:</b></p>
        <div style="white-space:pre-wrap;line-height:1.7">${safeMessage}</div>
      </div>
    </div>
  `;
}

export function contactSenderTemplate({ name, subject, timestamp }) {
  const safeName = escapeHtml(name);
  const safeSubject = escapeHtml(subject);
  const safeTimestamp = escapeHtml(timestamp);
  return `
    <div style="font-family:Inter,Arial,sans-serif;background:#080a12;color:#f8fafc;padding:28px">
      <div style="max-width:620px;margin:auto;border:1px solid rgba(255,255,255,.14);border-radius:14px;padding:26px;background:#111522">
        <p style="color:#2de2e6;text-transform:uppercase;letter-spacing:.18em;font-size:12px;font-weight:800">FilmHub Support</p>
        <h1 style="margin:12px 0 10px;font-size:28px">We received your message</h1>
        <p>Hello ${safeName},</p>
        <p>Your message about <b>${safeSubject}</b> reached the FilmHub team on ${safeTimestamp}.</p>
        <p style="color:#b8c1d1">We will reply to the email address you provided as soon as possible.</p>
      </div>
    </div>
  `;
}
