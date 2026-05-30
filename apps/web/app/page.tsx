"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "./landing.module.css";

const messages = [
  "పిలుపు — the Telugu word for Invitation 💌",
  "Send 1000 invites in under 60 seconds ⚡",
  "Weddings · Birthdays · Business Events 🎊",
  "Personalized WhatsApp cards, delivered reliably 📲",
  "Built for India. Priced for everyone. 🇮🇳",
];

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default function LandingPage() {
  const [text, setText] = useState("");
  const [msgIdx, setMsgIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const cur = messages[msgIdx];
    if (charIdx < cur.length) {
      const t = setTimeout(() => {
        setText((p) => p + cur[charIdx]);
        setCharIdx((p) => p + 1);
      }, 38);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setText("");
        setCharIdx(0);
        setMsgIdx((p) => (p + 1) % messages.length);
      }, 2200);
      return () => clearTimeout(t);
    }
  }, [charIdx, msgIdx]);

  useEffect(() => {
    let n = 0;
    const t = setInterval(() => {
      n += 47;
      if (n >= 10000) {
        setCount(10000);
        clearInterval(t);
      } else setCount(n);
    }, 16);
    return () => clearInterval(t);
  }, []);

  return (
    <div className={styles.page}>
      {/* NAVBAR */}
      <nav className={styles.nav}>
        <div className={styles.logo}>
          <span className={styles.logoP}>పి</span>
          <span className={styles.logoRest}>looopu</span>
        </div>

        <div className={styles.navMenu}>
          {["Features", "How it Works", "Pricing", "About", "Contact"].map((l) => (
            <a key={l} href={`#${l.toLowerCase().replace(/ /g, "-")}`} className={styles.navLink}>
              {l}
            </a>
          ))}
          <a href="/login" className={styles.btnGhost}>
            Login
          </a>
          <a href="/signup" className={styles.btnPrimary}>
            Get Started
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section className={styles.hero}>
        {[
          { w: 500, h: 500, l: "5%", t: "10%", c: "#e91e8c", d: 0, dur: 18 },
          { w: 400, h: 400, r: "5%", b: "10%", c: "#ff5252", d: 4, dur: 22 },
          { w: 300, h: 300, l: "55%", t: "55%", c: "#9c27b0", d: 8, dur: 16 },
          { w: 200, h: 200, l: "30%", t: "20%", c: "#ff9800", d: 12, dur: 20 },
        ].map((b, i) => (
          <div
            key={i}
            className={styles.blob}
            style={{
              width: b.w,
              height: b.h,
              left: (b as any).l,
              right: (b as any).r,
              top: (b as any).t,
              background: b.c,
              animation: `floatBubble ${b.dur}s ease-in-out infinite`,
              animationDelay: `${b.d}s`,
            }}
          />
        ))}

        <div className={styles.grid} />

        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <span>💌</span>
            <span>పిలుపు (పిlooopu) — Invitation in Telugu</span>
          </div>

          <h1 className={styles.heroTitle}>
            <span className={styles.shimmer}>Send Invites</span>
            <br />
            <span>Like Never</span> <em>Before</em>
          </h1>

          <p className={styles.heroSubtitle}>
            {text}
            <span className={styles.cursor}>|</span>
          </p>

          <div className={styles.heroCtas}>
            <a href="/signup" className={styles.btnPrimary}>
              Start for Free →
            </a>
            <a href="#how-it-works" className={styles.btnGhost}>
              See How It Works
            </a>
          </div>

          <div className={styles.stats}>
            {[
              { val: `${count.toLocaleString()}+`, label: "Messages Sent" },
              { val: "1,000+", label: "Events Created" },
              { val: "< 60s", label: "To Send 500 Invites" },
              { val: "99.9%", label: "Delivery Rate" },
            ].map((s) => (
              <div key={s.label} className={styles.stat}>
                <div className={styles.statValue}>{s.val}</div>
                <div className={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.scrollIndicator}>
          <div className={styles.scrollLabel}>Scroll</div>
          <div className={styles.scrollLine} />
        </div>
      </section>

      {/* FEATURES */}
      <section className={styles.featuresSection}>
        <Reveal>
          <div className={styles.sectionHeader}>
            <p className={styles.sectionLabel}>Why పిlooopu</p>
            <h2 className={styles.sectionTitle}>
              Everything you need to
              <br />
              <em>send the perfect invite</em>
            </h2>
          </div>
        </Reveal>

        <div className={styles.featureGrid}>
          {[
            {
              icon: "🎨",
              title: "Beautiful Templates",
              desc: "Wedding cards, birthday invites, business events — stunning designs built right in. No design skills needed.",
            },
            {
              icon: "⚡",
              title: "Bulk Sending in Seconds",
              desc: "Upload your guest list once, select a template, pay once. All 1000 invites queue and send automatically via WhatsApp.",
            },
            {
              icon: "📊",
              title: "Live Delivery Tracking",
              desc: "Watch in real-time as each invite is delivered. Know exactly who received it — no more guessing.",
            },
            {
              icon: "🔒",
              title: "Privacy First",
              desc: "Every phone number is AES-256 encrypted at rest. We see masked digits only. Your guests' data is safe.",
            },
            {
              icon: "🔁",
              title: "Automatic Retry",
              desc: "If a message fails, we retry up to 5 times with smart backoff. Zero missed guests.",
            },
            {
              icon: "💰",
              title: "Pay Per Message, Not Monthly",
              desc: "₹0.60 per text invite, ₹0.80 per image invite. 1000 guests = ₹600. Cheaper than printing cards. No subscription ever.",
            },
          ].map((f, i) => (
            <Reveal key={f.title} delay={i * 80}>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>{f.icon}</div>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDesc}>{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className={styles.howSection}>
        <div className={styles.howContent}>
          <Reveal>
            <div className={styles.sectionHeader}>
              <p className={styles.sectionLabel}>Simple as 1-2-3</p>
              <h2 className={styles.sectionTitle}>How పిlooopu Works</h2>
            </div>
          </Reveal>

          <div className={styles.stepsGrid}>
            {[
              {
                n: "01",
                icon: "👥",
                title: "Add Your Guests",
                desc: "Upload a CSV or manually add names + phone numbers. We encrypt every number instantly.",
              },
              {
                n: "02",
                icon: "🎨",
                title: "Pick a Template",
                desc: "Choose from wedding, birthday, or business templates. Preview exactly what your guests will see.",
              },
              {
                n: "03",
                icon: "💳",
                title: "Pay Per Message",
                desc: "₹0.60 for text, ₹0.80 for image. Pay only for what you send. No plans, no subscriptions, no minimums.",
              },
              {
                n: "04",
                icon: "🚀",
                title: "Invites Fly Out",
                desc: "Click send. Our queue delivers every invite via WhatsApp with retries. Done in minutes.",
              },
            ].map((s, i) => (
              <Reveal key={s.n} delay={i * 120}>
                <div className={styles.step}>
                  <div className={styles.stepIcon}>{s.icon}</div>
                  <div className={styles.stepLabel}>Step {s.n}</div>
                  <h3 className={styles.stepTitle}>{s.title}</h3>
                  <p className={styles.stepDesc}>{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className={styles.pricingSection}>
        <Reveal>
          <div className={styles.sectionHeader}>
            <p className={styles.sectionLabel}>Honest Pricing</p>
            <h2 className={styles.sectionTitle}>
              Pay per message.
              <br />
              <em>Not per month.</em>
            </h2>
            <p className={styles.pricingSubtitle}>
              Send 1 invite or 10,000 — you only pay for what you actually send.
              <br />
              No subscriptions. No plans. No surprises.
            </p>
          </div>
        </Reveal>

        <div className={styles.priceCardsGrid}>
          {[
            {
              icon: "💬",
              type: "Text Invite",
              rate: "₹0.60",
              unit: "per message",
              desc: "Plain WhatsApp text message with your event details. Fast, reliable, delivered instantly.",
              tag: "Most Used",
              popular: true,
              features: [
                "Plain WhatsApp message",
                "Personalised guest name",
                "Delivery tracking",
                "Auto-retry on failure",
              ],
              example: "1000 guests = ₹600 total",
            },
            {
              icon: "🖼️",
              type: "Image Invite",
              rate: "₹0.80",
              unit: "per message",
              desc: "Your designed invite card sent as a WhatsApp image. Beautiful, personal, memorable.",
              tag: "Premium Feel",
              popular: false,
              features: [
                "Custom designed image card",
                "Personalised via WhatsApp template",
                "Delivery tracking",
                "Auto-retry on failure",
              ],
              example: "1000 guests = ₹800 total",
            },
          ].map((p, i) => (
            <Reveal key={p.type} delay={i * 120}>
              <div className={`${styles.priceCard} ${p.popular ? styles.priceCardPopular : ""}`}>
                <div className={styles.priceTag}>{p.tag}</div>

                <div className={styles.priceIcon}>{p.icon}</div>
                <div className={styles.priceType}>{p.type}</div>

                <div className={styles.priceRate}>
                  <span className={styles.priceAmount}>{p.rate}</span>
                  <span className={styles.priceUnit}>{p.unit}</span>
                </div>

                <div className={styles.priceExample}>e.g. {p.example}</div>

                <p className={styles.priceDesc}>{p.desc}</p>

                <div className={styles.priceFeatures}>
                  {p.features.map((f) => (
                    <div key={f} className={styles.priceFeature}>
                      <span className={styles.priceFeatureCheck}>✓</span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
                <a href="/signup" className={p.popular ? styles.btnPrimary : styles.btnGhost}>
                  Start Sending
                </a>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <div className={styles.pricingCalculator}>
            <p className={styles.calculatorLabel}>Quick Estimate</p>
            <div className={styles.calculatorGrid}>
              {[
                { guests: "100", text: "₹60", image: "₹80" },
                { guests: "500", text: "₹300", image: "₹400" },
                { guests: "1,000", text: "₹600", image: "₹800" },
                { guests: "5,000", text: "₹3,000", image: "₹4,000" },
              ].map((r) => (
                <div key={r.guests} className={styles.calculatorItem}>
                  <div className={styles.calculatorGuests}>{r.guests} guests</div>
                  <div className={styles.calculatorPrices}>
                    <div>
                      <div className={styles.calculatorPrice}>{r.text}</div>
                      <div className={styles.calculatorType}>text</div>
                    </div>
                    <div className={styles.calculatorDot}>·</div>
                    <div>
                      <div className={styles.calculatorPriceImage}>{r.image}</div>
                      <div className={styles.calculatorType}>image</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className={styles.calculatorNote}>
              Compare: Printing + courier for 500 cards = ₹5,000+. పిlooopu = ₹300. 🙂
            </p>
          </div>
        </Reveal>
      </section>

      {/* ABOUT */}
      <section id="about" className={styles.aboutSection}>
        <div className={styles.aboutGrid}>
          <Reveal>
            <div className={styles.aboutContent}>
              <p className={styles.sectionLabel}>Our Story</p>
              <h2 className={styles.aboutTitle}>
                Built from a very
                <br />
                <em>Indian problem</em>
              </h2>
              <p className={styles.aboutPara}>
                Every family in India knows this scene — someone sitting with their phone,
                forwarding the same WhatsApp message to 600 contacts, one by one. Missing people.
                Getting blocked. Having no idea who actually received it.
              </p>
              <p className={styles.aboutPara}>
                This happens at Maharashtrian weddings and Punjabi shaadis, Tamil school events
                and Kannada business openings, Bengali pujas and Rajasthani functions. It's not a
                language problem — it's an India problem.
              </p>
              <p className={styles.aboutPara}>
                The name పిlooopu comes from పిలుపు — the Telugu word for "invitation." We chose it
                because across every language in India, the meaning is the same:{" "}
                <em>you are called, you are welcome, you belong here.</em>
              </p>

              <div className={styles.aboutStats}>
                {[
                  { v: "3+", l: "Years Backend Exp" },
                  { v: "100%", l: "Privacy First" },
                  { v: "₹0", l: "Hidden Fees" },
                ].map((s) => (
                  <div key={s.l}>
                    <div className={styles.aboutStatValue}>{s.v}</div>
                    <div className={styles.aboutStatLabel}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className={styles.aboutCardsGrid}>
              {[
                {
                  icon: "🇮🇳",
                  title: "Made in India",
                  desc: "Built by a developer who grew up watching aunties forward the same message 500 times at every family function.",
                },
                {
                  icon: "🔐",
                  title: "Your Data, Protected",
                  desc: "AES-256 encryption on all phone numbers. We never see your guests' real numbers.",
                },
                {
                  icon: "💌",
                  title: "Telugu Roots, Indian Soul",
                  desc: "పిlooopu = పిలుపు = Invitation. The name is Telugu. The product is for every Indian.",
                },
                {
                  icon: "🛠",
                  title: "Always Improving",
                  desc: "New templates, new features every sprint. Your feedback shapes the roadmap.",
                },
              ].map((c) => (
                <div key={c.title} className={styles.aboutCard}>
                  <div className={styles.aboutCardIcon}>{c.icon}</div>
                  <div className={styles.aboutCardTitle}>{c.title}</div>
                  <div className={styles.aboutCardDesc}>{c.desc}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className={styles.testimonialsSection}>
        <Reveal>
          <div className={styles.sectionHeader}>
            <p className={styles.sectionLabel}>What People Say</p>
            <h2 className={styles.sectionTitle}>Real stories, real events</h2>
          </div>
        </Reveal>
        <div className={styles.testimonialsGrid}>
          {[
            {
              name: "Priya Reddy",
              role: "Wedding Organiser, Hyderabad",
              text: "Sent 800 invites in 10 minutes. My in-laws were shocked. Used to take us 3 days of manual forwarding.",
              avatar: "👰",
            },
            {
              name: "Ramesh Kumar",
              role: "School Principal, Bangalore",
              text: "We use పిlooopu for every annual day and parent meeting. 600 parents, all notified instantly. Game changer.",
              avatar: "🎓",
            },
            {
              name: "Meghna Shah",
              role: "Event Planner, Mumbai",
              text: "The delivery tracking alone is worth it. I know exactly which 3 guests didn't receive the card and can follow up.",
              avatar: "🎪",
            },
          ].map((t, i) => (
            <Reveal key={t.name} delay={i * 100}>
              <div className={styles.testimonialCard}>
                <div className={styles.testimonialAvatar}>{t.avatar}</div>
                <p className={styles.testimonialText}>"{t.text}"</p>
                <div className={styles.testimonialName}>{t.name}</div>
                <div className={styles.testimonialRole}>{t.role}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className={styles.contactSection}>
        <div className={styles.contactContent}>
          <Reveal>
            <p className={styles.sectionLabel}>Get In Touch</p>
            <h2 className={styles.sectionTitle}>We'd love to hear from you</h2>
            <p className={styles.contactSubtitle}>
              Questions, feedback, feature requests, or just want to say hi — drop us a message. We
              reply within 24 hours.
            </p>
            <div className={styles.contactCardsGrid}>
              {[
                {
                  icon: "📧",
                  label: "Email Us",
                  value: "hello@pilooopu.shop",
                  href: "mailto:hello@pilooopu.shop",
                },
                {
                  icon: "💬",
                  label: "WhatsApp",
                  value: "+91 7348887772",
                  href: "https://wa.me/919876543210",
                },
                { icon: "📍", label: "Based In", value: "Bangalore, Karnataka", href: "#" },
              ].map((c) => (
                <a key={c.label} href={c.href} className={styles.contactCard}>
                  <div className={styles.contactIcon}>{c.icon}</div>
                  <div className={styles.contactLabel}>{c.label}</div>
                  <div className={styles.contactValue}>{c.value}</div>
                </a>
              ))}
            </div>
            <a href="/signup" className={styles.btnPrimary}>
              Start Sending Invites →
            </a>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <div className={styles.footerBrand}>
            <div className={styles.footerLogo}>
              <span className={styles.logoP}>పి</span>
              <span className={styles.logoRest}>looopu</span>
            </div>
            <p className={styles.footerDesc}>
              Bulk WhatsApp invitations for Indian weddings, birthdays, schools, and businesses.
              Reliable. Affordable. Beautiful.
            </p>
            <div className={styles.socialLinks}>
              {[
                { icon: "𝕏", href: "#" },
                { icon: "in", href: "#" },
                { icon: "▶", href: "#" },
              ].map((s) => (
                <a key={s.icon} href={s.href} className={styles.socialLink}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {["Product", "Company", "Legal"].map((col, idx) => (
            <div key={col}>
              <div className={styles.footerColLabel}>{col}</div>
              {[
                col === "Product"
                  ? ["Features", "Templates", "Pricing", "API Docs", "Changelog"]
                  : col === "Company"
                    ? ["About Us", "Blog", "Careers", "Press Kit", "Contact"]
                    : ["Privacy Policy", "Terms of Service", "Refund Policy", "Cookie Policy", "WhatsApp Policy"],
              ][0].map((l) => (
                <a
                  key={l}
                  href={
                    l === "About Us"
                      ? "#about"
                      : l === "Contact"
                        ? "#contact"
                        : "#"
                  }
                  className={styles.footerLink}
                >
                  {l}
                </a>
              ))}
            </div>
          ))}
        </div>

        <div className={styles.footerBottom}>
          <p className={styles.footerCopy}>
            © 2025 పిlooopu. Built with ❤️ in Bangalore, India.
          </p>
          <div className={styles.footerStatus}>
            <div className={styles.statusDot} />
            <span>All systems operational</span>
          </div>
          <p className={styles.footerCopy}>
            పిలుపు — Invitation in Telugu 🙏
          </p>
        </div>
      </footer>
    </div>
  );
}