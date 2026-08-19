import { Clock3, Facebook, Film, Headphones, Instagram, Mail, MessageCircle, Send, ShieldQuestion, Sparkles } from "lucide-react";
import { FormEvent, useState } from "react";
import { api } from "../lib/api";
import { sampleFilms } from "../lib/mockData";

const cards = [
  { icon: Mail, title: "Gmail", value: "salmaelazouazi@gmail.com", href: "mailto:salmaelazouazi@gmail.com" },
  { icon: Instagram, title: "Instagram", value: "@call_me_salma_el", href: "https://www.instagram.com/call_me_salma_el" },
  { icon: Facebook, title: "Facebook", value: "Salma El Azouazi", href: "https://www.facebook.com/search/top?q=salma%20el%20azouazi" },
  { icon: Clock3, title: "Response window", value: "Within 1 business day", href: "mailto:salmaelazouazi@gmail.com" }
];

const faqs = [
  ["Can I report a post?", "Yes. Send the post title or link and the moderation team will review it."],
  ["Can I request a category?", "Yes. Include the category name, icon idea, and a short description."],
  ["Can FilmHub support video uploads?", "Yes. Members can upload WebM/MP4 trailers or embed YouTube videos."]
];

const support = [
  { icon: Headphones, label: "Account support", text: "Login, password reset, profile, and posting access." },
  { icon: ShieldQuestion, label: "Moderation", text: "Blocked posts, category cleanup, comments, and safety reports." },
  { icon: MessageCircle, label: "Partnerships", text: "Class demos, screenings, showcases, and collaboration requests." }
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setStatus("");
    setError("");
    try {
      const data = await api<{ message: string }>("/contact", {
        method: "POST",
        body: JSON.stringify(form)
      });
      setStatus(data.message);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Message could not be sent");
    }
  }

  return (
    <section className="contact-page">
      <div className="auth-cinema-stage contact-auth-stage">
        <div className="auth-light auth-light-left" />
        <div className="auth-light auth-light-right" />
        <div className="auth-poster-world" aria-hidden="true">
          {sampleFilms.slice(0, 5).map((film, index) => (
            <div key={film.title} className={`auth-poster-card auth-poster-${index + 1}`}>
              <img className="moving-poster-img" src={film.poster} alt="" />
              <div>
                <span>{film.genre}</span>
                <b>{film.title}</b>
              </div>
            </div>
          ))}
        </div>

        <div className="auth-copy">
          <div className="inline-flex items-center gap-2 rounded border border-white/15 bg-white/8 px-3 py-2 text-sm text-cinema-teal">
            <Sparkles size={16} /> FilmHub support desk
          </div>
          <h1>Reach the control room.</h1>
          <p>Send account questions, moderation requests, category ideas, partnership notes, or technical issues directly to the FilmHub team.</p>
          <div className="contact-socials">
            <a aria-label="Gmail" href="mailto:salmaelazouazi@gmail.com"><Mail size={18} /></a>
            <a aria-label="Instagram" href="https://www.instagram.com/call_me_salma_el" target="_blank" rel="noreferrer"><Instagram size={18} /></a>
            <a aria-label="Facebook" href="https://www.facebook.com/search/top?q=salma%20el%20azouazi" target="_blank" rel="noreferrer"><Facebook size={18} /></a>
          </div>
        </div>

        <div className="auth-form-wrap">
          <form onSubmit={submit} className="auth-ticket-form contact-auth-ticket">
            <div className="auth-ticket-header">
              <div>
                <span>Direct message</span>
                <h2>Contact FilmHub</h2>
              </div>
              <Film />
            </div>
            <p className="auth-subtitle">Your name, Gmail, subject, and message are emailed to the site owner and saved for follow-up.</p>
            <div className="auth-form-grid">
              <label>
                <span>Name</span>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required minLength={2} placeholder="Your name" />
              </label>
              <label>
                <span>Gmail</span>
                <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required type="email" pattern="^[a-zA-Z0-9._%+-]+@gmail\.com$" placeholder="yourname@gmail.com" />
              </label>
              <label>
                <span>Subject</span>
                <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required minLength={3} placeholder="How can we help?" />
              </label>
              <label>
                <span>Message</span>
                <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required minLength={10} rows={6} placeholder="Tell us what happened or what you need." />
              </label>
              <button className="auth-primary"><Send size={18} />Send message</button>
            </div>
            {status && <p className="contact-success">{status}</p>}
            {error && <p className="contact-error">{error}</p>}
          </form>
        </div>
      </div>

      <div className="contact-content">
        <div className="contact-card-grid">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <article key={card.title} className="contact-card">
                <a href={card.href} target={card.href.startsWith("mailto:") ? undefined : "_blank"} rel={card.href.startsWith("mailto:") ? undefined : "noreferrer"}>
                  <Icon />
                  <span>{card.title}</span>
                  <b>{card.value}</b>
                </a>
              </article>
            );
          })}
        </div>

        <section>
          <div className="mb-5">
            <p className="text-sm uppercase tracking-[0.24em] text-cinema-teal">Support</p>
            <h2 className="text-3xl font-black">Where your message goes</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {support.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.label} className="contact-info-panel">
                  <Icon />
                  <h3>{item.label}</h3>
                  <p>{item.text}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="contact-faq">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-cinema-teal">FAQ</p>
            <h2>Quick answers</h2>
          </div>
          <div className="grid gap-3">
            {faqs.map(([question, answer]) => (
              <details key={question}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
