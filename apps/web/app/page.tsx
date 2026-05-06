"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// ── Typing effect messages ─────────────────────────
const messages = [
  "పిలుపు — the Telugu word for Invitation 💌",
  "Send 1000 invites in under 60 seconds ⚡",
  "Weddings · Birthdays · Business Events 🎊",
  "Personalized WhatsApp cards, delivered reliably 📲",
  "Built for India. Priced for everyone. 🇮🇳",
];

// ── Scroll reveal hook ─────────────────────────────
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

// ── Section wrapper with reveal ────────────────────
function Reveal({ children, delay = 0, className = "" }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity:    visible ? 1 : 0,
        transform:  visible ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default function LandingPage() {
  const [text, setText]           = useState("");
  const [msgIdx, setMsgIdx]       = useState(0);
  const [charIdx, setCharIdx]     = useState(0);
  const [count, setCount]         = useState(0);
  const [menuOpen, setMenuOpen]   = useState(false);

  // Typing effect
  useEffect(() => {
    const cur = messages[msgIdx];
    if (charIdx < cur.length) {
      const t = setTimeout(() => {
        setText(p => p + cur[charIdx]);
        setCharIdx(p => p + 1);
      }, 38);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setText(""); setCharIdx(0);
        setMsgIdx(p => (p + 1) % messages.length);
      }, 2200);
      return () => clearTimeout(t);
    }
  }, [charIdx, msgIdx]);

  // Counter animation
  useEffect(() => {
    let n = 0;
    const t = setInterval(() => {
      n += 47;
      if (n >= 10000) { setCount(10000); clearInterval(t); }
      else setCount(n);
    }, 16);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ fontFamily: "'Playfair Display', Georgia, serif", background: "#0d0810", color: "#f5f0ff", overflowX: "hidden" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0d0810; }
        ::-webkit-scrollbar-thumb { background: #e91e8c; border-radius: 2px; }

        .btn-primary {
          display: inline-block;
          padding: 14px 36px;
          border-radius: 100px;
          background: linear-gradient(135deg, #e91e8c, #ff5252);
          color: white;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          font-size: 15px;
          letter-spacing: 0.3px;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 24px rgba(233,30,140,0.35);
        }
        .btn-primary:hover { transform: scale(1.05); box-shadow: 0 8px 36px rgba(233,30,140,0.5); }

        .btn-ghost {
          display: inline-block;
          padding: 14px 36px;
          border-radius: 100px;
          border: 1px solid rgba(245,240,255,0.2);
          color: rgba(245,240,255,0.7);
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          text-decoration: none;
          transition: all 0.2s;
        }
        .btn-ghost:hover { border-color: rgba(233,30,140,0.5); color: #e91e8c; }

        .glow { text-shadow: 0 0 60px rgba(233,30,140,0.4); }

        @keyframes floatBubble {
          0%   { transform: translateY(0) translateX(0) scale(1); }
          33%  { transform: translateY(-30px) translateX(15px) scale(1.05); }
          66%  { transform: translateY(10px) translateX(-10px) scale(0.97); }
          100% { transform: translateY(0) translateX(0) scale(1); }
        }

        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        @keyframes pulse-ring {
          0%   { transform: scale(0.9); opacity: 0.7; }
          50%  { transform: scale(1.1); opacity: 0.3; }
          100% { transform: scale(0.9); opacity: 0.7; }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .shimmer-text {
          background: linear-gradient(90deg, #f5f0ff 0%, #e91e8c 30%, #ff9800 50%, #e91e8c 70%, #f5f0ff 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }

        .card-glass {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          backdrop-filter: blur(12px);
          transition: transform 0.3s, border-color 0.3s, box-shadow 0.3s;
        }
        .card-glass:hover {
          transform: translateY(-6px);
          border-color: rgba(233,30,140,0.3);
          box-shadow: 0 12px 40px rgba(233,30,140,0.15);
        }

        .step-line::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 100%;
          width: 60px;
          height: 1px;
          background: linear-gradient(90deg, rgba(233,30,140,0.5), transparent);
        }

        .nav-link {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: rgba(245,240,255,0.6);
          text-decoration: none;
          transition: color 0.2s;
          letter-spacing: 0.3px;
        }
        .nav-link:hover { color: #e91e8c; }

        @media (max-width: 768px) {
          .nav-link { display: none; }
        }

        .price-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 36px 28px;
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
        }
        .price-card.popular {
          border-color: rgba(233,30,140,0.4);
          background: rgba(233,30,140,0.06);
        }
        .price-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.4);
        }

        .faq-item {
          border-bottom: 1px solid rgba(255,255,255,0.06);
          padding: 20px 0;
          cursor: pointer;
        }
      `}</style>

      {/* ══════════════════════════════════════
          NAVBAR
      ══════════════════════════════════════ */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "16px 40px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        backdropFilter: "blur(20px)",
        background: "rgba(13,8,16,0.8)",
      }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 900 }}>
          <span style={{ color: "#e91e8c" }}>పి</span>
          <span style={{ color: "#f5f0ff" }}>lupoo</span>
        </div>

        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {["Features","How it Works","Pricing","About","Contact"].map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(/ /g,"-")}`} className="nav-link">
              {l}
            </a>
          ))}
          <a href="/login" className="btn-ghost" style={{ padding: "8px 20px", fontSize: 13 }}>Login</a>
          <a href="/signup" className="btn-primary" style={{ padding: "10px 22px", fontSize: 13 }}>Get Started</a>
        </div>
      </nav>

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", overflow: "hidden", paddingTop: 80, paddingBottom: 60,
      }}>
        {/* Bubbles */}
        {[
          { w:500, h:500, l:"5%",  t:"10%", c:"#e91e8c", d:0,  dur:18 },
          { w:400, h:400, r:"5%",  b:"10%", c:"#ff5252", d:4,  dur:22 },
          { w:300, h:300, l:"55%", t:"55%", c:"#9c27b0", d:8,  dur:16 },
          { w:200, h:200, l:"30%", t:"20%", c:"#ff9800", d:12, dur:20 },
        ].map((b,i) => (
          <div key={i} style={{
            position:"absolute", borderRadius:"50%",
            width: b.w, height: b.h,
            left: (b as any).l, right: (b as any).r,
            top: (b as any).t, bottom: (b as any).b,
            background: b.c, filter: "blur(100px)", opacity: 0.12,
            animation: `floatBubble ${b.dur}s ease-in-out infinite`,
            animationDelay: `${b.d}s`,
          }}/>
        ))}

        {/* Dot grid */}
        <div style={{
          position:"absolute", inset:0, opacity:0.04,
          backgroundImage: "radial-gradient(circle, #f5f0ff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}/>

        <div style={{ textAlign:"center", position:"relative", zIndex:1, padding:"0 24px", maxWidth:860, margin:"0 auto" }}>

          {/* Telugu badge */}
          <div style={{
            display:"inline-flex", alignItems:"center", gap:8,
            background:"rgba(233,30,140,0.12)", border:"1px solid rgba(233,30,140,0.25)",
            borderRadius:100, padding:"6px 18px", marginBottom:28,
            fontFamily:"'DM Sans',sans-serif", fontSize:13, color:"rgba(245,240,255,0.7)",
            animation: "fadeUp 0.6s ease both",
          }}>
            <span style={{ fontSize:18 }}>💌</span>
            <span>పిలుపు (Pilupoo) — Invitation in Telugu</span>
          </div>

          {/* Main headline */}
          <h1 style={{
            fontSize: "clamp(48px, 8vw, 92px)",
            fontWeight: 900, lineHeight: 1.05, marginBottom: 24,
            animation: "fadeUp 0.6s ease 0.1s both",
          }}>
            <span className="shimmer-text">Send Invites</span><br/>
            <span style={{ color:"rgba(245,240,255,0.9)" }}>Like Never</span>{" "}
            <em style={{ color:"#e91e8c", fontStyle:"italic" }}>Before</em>
          </h1>

          {/* Typing subtitle */}
          <p style={{
            fontFamily:"'DM Sans',sans-serif", fontSize:"clamp(16px,2.5vw,20px)",
            color:"rgba(245,240,255,0.55)", minHeight:32, marginBottom:40,
            animation: "fadeUp 0.6s ease 0.2s both",
          }}>
            {text}<span style={{ animation:"pulse-ring 0.8s infinite", display:"inline-block", marginLeft:2 }}>|</span>
          </p>

          {/* CTAs */}
          <div style={{
            display:"flex", gap:16, justifyContent:"center", flexWrap:"wrap",
            animation: "fadeUp 0.6s ease 0.3s both",
          }}>
            <a href="/signup" className="btn-primary" style={{ fontSize:16 }}>
              Start for Free →
            </a>
            <a href="#how-it-works" className="btn-ghost" style={{ fontSize:16 }}>
              See How It Works
            </a>
          </div>

          {/* Stats */}
          <div style={{
            display:"flex", gap:40, justifyContent:"center", marginTop:60,
            flexWrap:"wrap", animation: "fadeUp 0.6s ease 0.4s both",
          }}>
            {[
              { val:`${count.toLocaleString()}+`, label:"Messages Sent" },
              { val:"1,000+",                     label:"Events Created" },
              { val:"< 60s",                       label:"To Send 500 Invites" },
              { val:"99.9%",                       label:"Delivery Rate" },
            ].map(s => (
              <div key={s.label} style={{ textAlign:"center" }}>
                <div style={{ fontSize:"clamp(22px,4vw,32px)", fontWeight:900, color:"#e91e8c" }}>{s.val}</div>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:"rgba(245,240,255,0.4)", marginTop:2, letterSpacing:"0.05em", textTransform:"uppercase" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position:"absolute", bottom:30, left:"50%", transform:"translateX(-50%)",
          display:"flex", flexDirection:"column", alignItems:"center", gap:6, opacity:0.3,
          animation:"fadeUp 1s ease 1s both",
        }}>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, letterSpacing:"0.15em", textTransform:"uppercase" }}>Scroll</div>
          <div style={{ width:1, height:40, background:"linear-gradient(to bottom, rgba(245,240,255,0.5), transparent)" }}/>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FEATURES
      ══════════════════════════════════════ */}
      <section id="features" style={{ padding:"100px 40px", maxWidth:1100, margin:"0 auto" }}>
        <Reveal>
          <div style={{ textAlign:"center", marginBottom:64 }}>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, letterSpacing:"0.2em", textTransform:"uppercase", color:"#e91e8c", marginBottom:12 }}>Why Pilupoo</p>
            <h2 style={{ fontSize:"clamp(32px,5vw,52px)", fontWeight:900, lineHeight:1.1 }}>
              Everything you need to<br/>
              <em style={{ fontStyle:"italic", color:"rgba(245,240,255,0.5)" }}>send the perfect invite</em>
            </h2>
          </div>
        </Reveal>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))", gap:20 }}>
          {[
            { icon:"🎨", title:"Beautiful Templates", desc:"Wedding cards, birthday invites, business events — stunning designs built right in. No design skills needed." },
            { icon:"⚡", title:"Bulk Sending in Seconds", desc:"Upload your guest list once, select a template, pay once. All 1000 invites queue and send automatically via WhatsApp." },
            { icon:"📊", title:"Live Delivery Tracking", desc:"Watch in real-time as each invite is delivered. Know exactly who received it — no more guessing." },
            { icon:"🔒", title:"Privacy First", desc:"Every phone number is AES-256 encrypted at rest. We see masked digits only. Your guests' data is safe." },
            { icon:"🔁", title:"Automatic Retry", desc:"If a message fails, we retry up to 5 times with smart backoff. Zero missed guests." },
            { icon:"💰", title:"Pay Per Message, Not Monthly", desc:"₹0.60 per text invite, ₹0.80 per image invite. 1000 guests = ₹600. Cheaper than printing cards. No subscription ever." },
          ].map((f, i) => (
            <Reveal key={f.title} delay={i * 80}>
              <div className="card-glass" style={{ padding:"28px 24px" }}>
                <div style={{ fontSize:36, marginBottom:16 }}>{f.icon}</div>
                <h3 style={{ fontSize:18, fontWeight:700, marginBottom:8 }}>{f.title}</h3>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:"rgba(245,240,255,0.5)", lineHeight:1.65 }}>{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════ */}
      <section id="how-it-works" style={{ padding:"100px 40px", background:"rgba(255,255,255,0.02)" }}>
        <div style={{ maxWidth:1000, margin:"0 auto" }}>
          <Reveal>
            <div style={{ textAlign:"center", marginBottom:72 }}>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, letterSpacing:"0.2em", textTransform:"uppercase", color:"#e91e8c", marginBottom:12 }}>Simple as 1-2-3</p>
              <h2 style={{ fontSize:"clamp(32px,5vw,52px)", fontWeight:900 }}>How Pilupoo Works</h2>
            </div>
          </Reveal>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap:40 }}>
            {[
              { n:"01", icon:"👥", title:"Add Your Guests", desc:"Upload a CSV or manually add names + phone numbers. We encrypt every number instantly." },
              { n:"02", icon:"🎨", title:"Pick a Template", desc:"Choose from wedding, birthday, or business templates. Preview exactly what your guests will see." },
              { n:"03", icon:"💳", title:"Pay Per Message", desc:"₹0.60 for text, ₹0.80 for image. Pay only for what you send. No plans, no subscriptions, no minimums." },
              { n:"04", icon:"🚀", title:"Invites Fly Out", desc:"Click send. Our queue delivers every invite via WhatsApp with retries. Done in minutes." },
            ].map((s, i) => (
              <Reveal key={s.n} delay={i * 120}>
                <div style={{ textAlign:"center", padding:"0 8px" }}>
                  <div style={{
                    width:70, height:70, borderRadius:"50%", margin:"0 auto 20px",
                    background:"rgba(233,30,140,0.12)", border:"1px solid rgba(233,30,140,0.25)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:28,
                  }}>{s.icon}</div>
                  <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, letterSpacing:"0.2em", color:"#e91e8c", marginBottom:6, textTransform:"uppercase" }}>Step {s.n}</div>
                  <h3 style={{ fontSize:18, fontWeight:700, marginBottom:10 }}>{s.title}</h3>
                  <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:"rgba(245,240,255,0.45)", lineHeight:1.65 }}>{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PRICING
      ══════════════════════════════════════ */}
      <section id="pricing" style={{ padding:"100px 40px", maxWidth:1000, margin:"0 auto" }}>
        <Reveal>
          <div style={{ textAlign:"center", marginBottom:20 }}>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, letterSpacing:"0.2em", textTransform:"uppercase", color:"#e91e8c", marginBottom:12 }}>Honest Pricing</p>
            <h2 style={{ fontSize:"clamp(32px,5vw,52px)", fontWeight:900, lineHeight:1.1 }}>
              Pay per message.<br/>
              <em style={{ fontStyle:"italic", color:"rgba(245,240,255,0.4)" }}>Not per month.</em>
            </h2>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:16, color:"rgba(245,240,255,0.45)", marginTop:16, lineHeight:1.7 }}>
              Send 1 invite or 10,000 — you only pay for what you actually send.<br/>No subscriptions. No plans. No surprises.
            </p>
          </div>
        </Reveal>

        {/* Two rate cards */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))", gap:20, marginTop:52, marginBottom:48 }}>
          {[
            {
              icon:"💬",
              type:"Text Invite",
              rate:"₹0.60",
              unit:"per message",
              desc:"Plain WhatsApp text message with your event details. Fast, reliable, delivered instantly.",
              tag:"Most Used",
              popular: true,
              features:["Plain WhatsApp message","Personalised guest name","Delivery tracking","Auto-retry on failure"],
              example:"1000 guests = ₹600 total",
            },
            {
              icon:"🖼️",
              type:"Image Invite",
              rate:"₹0.80",
              unit:"per message",
              desc:"Your designed invite card sent as a WhatsApp image. Beautiful, personal, memorable.",
              tag:"Premium Feel",
              popular: false,
              features:["Custom designed image card","Personalised via WhatsApp template","Delivery tracking","Auto-retry on failure"],
              example:"1000 guests = ₹800 total",
            },
          ].map((p, i) => (
            <Reveal key={p.type} delay={i * 120}>
              <div className={`price-card ${p.popular ? "popular" : ""}`}>
                <div style={{
                  position:"absolute", top:16, right:16,
                  background: p.popular ? "linear-gradient(135deg,#e91e8c,#ff5252)" : "rgba(255,255,255,0.08)",
                  borderRadius:100, padding:"3px 12px",
                  fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:600,
                  color: p.popular ? "white" : "rgba(245,240,255,0.5)",
                }}>{p.tag}</div>

                <div style={{ fontSize:36, marginBottom:16 }}>{p.icon}</div>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:"rgba(245,240,255,0.45)", marginBottom:8, letterSpacing:"0.05em", textTransform:"uppercase" }}>{p.type}</div>

                {/* Big rate */}
                <div style={{ display:"flex", alignItems:"flex-end", gap:6, marginBottom:4 }}>
                  <span style={{ fontSize:"clamp(52px,7vw,68px)", fontWeight:900, color:"#e91e8c", lineHeight:1 }}>{p.rate}</span>
                  <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:"rgba(245,240,255,0.4)", paddingBottom:10 }}>{p.unit}</span>
                </div>

                {/* Example calc */}
                <div style={{
                  fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:600,
                  color:"rgba(233,30,140,0.8)", marginBottom:16,
                  background:"rgba(233,30,140,0.08)", border:"1px solid rgba(233,30,140,0.15)",
                  borderRadius:8, padding:"6px 12px", display:"inline-block",
                }}>
                  e.g. {p.example}
                </div>

                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:"rgba(245,240,255,0.4)", marginBottom:24, lineHeight:1.6 }}>{p.desc}</p>

                <div style={{ borderTop:"1px solid rgba(255,255,255,0.06)", paddingTop:20, marginBottom:28 }}>
                  {p.features.map(f => (
                    <div key={f} style={{ display:"flex", gap:10, alignItems:"center", marginBottom:10 }}>
                      <span style={{ color:"#e91e8c", fontSize:14 }}>✓</span>
                      <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:"rgba(245,240,255,0.6)" }}>{f}</span>
                    </div>
                  ))}
                </div>
                <a href="/signup" className={p.popular ? "btn-primary" : "btn-ghost"} style={{ width:"100%", textAlign:"center", display:"block", padding:"13px 20px" }}>
                  Start Sending
                </a>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Calculator strip */}
        <Reveal delay={200}>
          <div style={{
            background:"rgba(233,30,140,0.06)", border:"1px solid rgba(233,30,140,0.15)",
            borderRadius:20, padding:"32px 36px", textAlign:"center",
          }}>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:"rgba(245,240,255,0.4)", marginBottom:16, letterSpacing:"0.1em", textTransform:"uppercase" }}>Quick Estimate</p>
            <div style={{ display:"flex", justifyContent:"center", flexWrap:"wrap", gap:32 }}>
              {[
                { guests:"100", text:"₹60", image:"₹80" },
                { guests:"500", text:"₹300", image:"₹400" },
                { guests:"1,000", text:"₹600", image:"₹800" },
                { guests:"5,000", text:"₹3,000", image:"₹4,000" },
              ].map(r => (
                <div key={r.guests} style={{ textAlign:"center" }}>
                  <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:"rgba(245,240,255,0.3)", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:6 }}>{r.guests} guests</div>
                  <div style={{ display:"flex", gap:12 }}>
                    <div>
                      <div style={{ fontSize:20, fontWeight:900, color:"#f5f0ff" }}>{r.text}</div>
                      <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, color:"rgba(245,240,255,0.3)" }}>text</div>
                    </div>
                    <div style={{ color:"rgba(255,255,255,0.1)", fontSize:20 }}>·</div>
                    <div>
                      <div style={{ fontSize:20, fontWeight:900, color:"#e91e8c" }}>{r.image}</div>
                      <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, color:"rgba(245,240,255,0.3)" }}>image</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:"rgba(245,240,255,0.25)", marginTop:20 }}>
              Compare: Printing + courier for 500 cards = ₹5,000+. Pilupoo = ₹300. 🙂
            </p>
          </div>
        </Reveal>
      </section>

      {/* ══════════════════════════════════════
          ABOUT
      ══════════════════════════════════════ */}
      <section id="about" style={{ padding:"100px 40px", background:"rgba(233,30,140,0.04)", borderTop:"1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth:900, margin:"0 auto" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))", gap:64, alignItems:"center" }}>
            <Reveal>
              <div>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, letterSpacing:"0.2em", textTransform:"uppercase", color:"#e91e8c", marginBottom:14 }}>Our Story</p>
                <h2 style={{ fontSize:"clamp(28px,4vw,44px)", fontWeight:900, lineHeight:1.15, marginBottom:24 }}>
                  Built from a very<br/>
                  <em style={{ fontStyle:"italic", color:"rgba(245,240,255,0.5)" }}>Indian problem</em>
                </h2>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:15, color:"rgba(245,240,255,0.5)", lineHeight:1.75, marginBottom:16 }}>
                  Every family in India knows this scene — someone sitting with their phone, forwarding the same WhatsApp message to 600 contacts, one by one. Missing people. Getting blocked. Having no idea who actually received it.
                </p>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:15, color:"rgba(245,240,255,0.5)", lineHeight:1.75, marginBottom:16 }}>
                  This happens at Maharashtrian weddings and Punjabi shaadis, Tamil school events and Kannada business openings, Bengali pujas and Rajasthani functions. It's not a language problem — it's an India problem.
                </p>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:15, color:"rgba(245,240,255,0.5)", lineHeight:1.75, marginBottom:24 }}>
                  The name Pilupoo comes from పిలుపు — the Telugu word for "invitation." We chose it because across every language in India, the meaning is the same: <em style={{ color:"rgba(245,240,255,0.7)" }}>you are called, you are welcome, you belong here.</em>
                </p>
                <div style={{ display:"flex", gap:24 }}>
                  {[{ v:"3+", l:"Years Backend Exp" },{ v:"100%", l:"Privacy First" },{ v:"₹0", l:"Hidden Fees" }].map(s => (
                    <div key={s.l}>
                      <div style={{ fontSize:24, fontWeight:900, color:"#e91e8c" }}>{s.v}</div>
                      <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:"rgba(245,240,255,0.35)", textTransform:"uppercase", letterSpacing:"0.05em" }}>{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={150}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                {[
                  { icon:"🇮🇳", title:"Made in India", desc:"Built by a developer who grew up watching aunties forward the same message 500 times at every family function." },
                  { icon:"🔐", title:"Your Data, Protected", desc:"AES-256 encryption on all phone numbers. We never see your guests' real numbers." },
                  { icon:"💌", title:"Telugu Roots, Indian Soul", desc:"Pilupoo = పిలుపు = Invitation. The name is Telugu. The product is for every Indian." },
                  { icon:"🛠", title:"Always Improving", desc:"New templates, new features every sprint. Your feedback shapes the roadmap." },
                ].map(c => (
                  <div key={c.title} className="card-glass" style={{ padding:"20px 16px" }}>
                    <div style={{ fontSize:28, marginBottom:10 }}>{c.icon}</div>
                    <div style={{ fontWeight:700, fontSize:14, marginBottom:6 }}>{c.title}</div>
                    <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:"rgba(245,240,255,0.4)", lineHeight:1.55 }}>{c.desc}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════ */}
      <section style={{ padding:"100px 40px", maxWidth:1000, margin:"0 auto" }}>
        <Reveal>
          <div style={{ textAlign:"center", marginBottom:56 }}>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, letterSpacing:"0.2em", textTransform:"uppercase", color:"#e91e8c", marginBottom:12 }}>What People Say</p>
            <h2 style={{ fontSize:"clamp(28px,4vw,44px)", fontWeight:900 }}>Real stories, real events</h2>
          </div>
        </Reveal>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))", gap:20 }}>
          {[
            { name:"Priya Reddy", role:"Wedding Organiser, Hyderabad", text:"Sent 800 invites in 10 minutes. My in-laws were shocked. Used to take us 3 days of manual forwarding.", avatar:"👰" },
            { name:"Ramesh Kumar", role:"School Principal, Bangalore", text:"We use Pilupoo for every annual day and parent meeting. 600 parents, all notified instantly. Game changer.", avatar:"🎓" },
            { name:"Meghna Shah", role:"Event Planner, Mumbai", text:"The delivery tracking alone is worth it. I know exactly which 3 guests didn't receive the card and can follow up.", avatar:"🎪" },
          ].map((t, i) => (
            <Reveal key={t.name} delay={i * 100}>
              <div className="card-glass" style={{ padding:"28px 24px" }}>
                <div style={{ fontSize:28, marginBottom:16 }}>{t.avatar}</div>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:"rgba(245,240,255,0.6)", lineHeight:1.7, marginBottom:20, fontStyle:"italic" }}>"{t.text}"</p>
                <div style={{ fontWeight:700, fontSize:14 }}>{t.name}</div>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:"rgba(245,240,255,0.35)", marginTop:2 }}>{t.role}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          CONTACT
      ══════════════════════════════════════ */}
      <section id="contact" style={{ padding:"100px 40px", background:"rgba(255,255,255,0.02)", borderTop:"1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth:700, margin:"0 auto", textAlign:"center" }}>
          <Reveal>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, letterSpacing:"0.2em", textTransform:"uppercase", color:"#e91e8c", marginBottom:14 }}>Get In Touch</p>
            <h2 style={{ fontSize:"clamp(28px,4vw,44px)", fontWeight:900, marginBottom:16 }}>We'd love to hear from you</h2>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:15, color:"rgba(245,240,255,0.4)", marginBottom:48, lineHeight:1.7 }}>
              Questions, feedback, feature requests, or just want to say hi — drop us a message. We reply within 24 hours.
            </p>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap:16, marginBottom:40 }}>
              {[
                { icon:"📧", label:"Email Us", value:"hello@pilupoo.com", href:"mailto:hello@pilooopu.shop" },
                { icon:"💬", label:"WhatsApp", value:"+91 7348887772", href:"https://wa.me/919876543210" },
                { icon:"📍", label:"Based In", value:"Bangalore, Karnataka", href:"#" },
              ].map(c => (
                <a key={c.label} href={c.href} className="card-glass" style={{ padding:"24px 20px", textDecoration:"none", display:"block" }}>
                  <div style={{ fontSize:28, marginBottom:10 }}>{c.icon}</div>
                  <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:"#e91e8c", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:4 }}>{c.label}</div>
                  <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:"rgba(245,240,255,0.7)" }}>{c.value}</div>
                </a>
              ))}
            </div>
            <a href="/signup" className="btn-primary" style={{ fontSize:16 }}>Start Sending Invites →</a>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FOOTER
      ══════════════════════════════════════ */}
      <footer style={{
        borderTop:"1px solid rgba(255,255,255,0.06)",
        padding:"60px 40px 32px",
        background:"rgba(0,0,0,0.3)",
      }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>

          {/* Footer top */}
          <div style={{ display:"grid", gridTemplateColumns:"2fr repeat(3, 1fr)", gap:48, marginBottom:48, flexWrap:"wrap" }}>

            {/* Brand */}
            <div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:28, fontWeight:900, marginBottom:12 }}>
                <span style={{ color:"#e91e8c" }}>పి</span>
                <span style={{ color:"#f5f0ff" }}>lupoo</span>
              </div>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:"rgba(245,240,255,0.35)", lineHeight:1.7, maxWidth:260, marginBottom:20 }}>
                Bulk WhatsApp invitations for Indian weddings, birthdays, schools, and businesses. Reliable. Affordable. Beautiful.
              </p>
              <div style={{ display:"flex", gap:12 }}>
                {[
                  { icon:"𝕏", href:"#" },
                  { icon:"in", href:"#" },
                  { icon:"▶", href:"#" },
                ].map(s => (
                  <a key={s.icon} href={s.href} style={{
                    width:36, height:36, borderRadius:"50%",
                    background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    color:"rgba(245,240,255,0.5)", textDecoration:"none", fontSize:13,
                    transition:"all 0.2s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "#e91e8c", e.currentTarget.style.color = "#e91e8c")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)", e.currentTarget.style.color = "rgba(245,240,255,0.5)")}>
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Product */}
            <div>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, letterSpacing:"0.15em", textTransform:"uppercase", color:"rgba(245,240,255,0.3)", marginBottom:20 }}>Product</div>
              {["Features","Templates","Pricing","API Docs","Changelog"].map(l => (
                <a key={l} href="#" style={{ display:"block", fontFamily:"'DM Sans',sans-serif", fontSize:13, color:"rgba(245,240,255,0.45)", marginBottom:12, textDecoration:"none", transition:"color 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.color = "#e91e8c"}
                  onMouseLeave={e => e.currentTarget.style.color = "rgba(245,240,255,0.45)"}>
                  {l}
                </a>
              ))}
            </div>

            {/* Company */}
            <div>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, letterSpacing:"0.15em", textTransform:"uppercase", color:"rgba(245,240,255,0.3)", marginBottom:20 }}>Company</div>
              {["About Us","Blog","Careers","Press Kit","Contact"].map(l => (
                <a key={l} href={l === "About Us" ? "#about" : l === "Contact" ? "#contact" : "#"} style={{ display:"block", fontFamily:"'DM Sans',sans-serif", fontSize:13, color:"rgba(245,240,255,0.45)", marginBottom:12, textDecoration:"none", transition:"color 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.color = "#e91e8c"}
                  onMouseLeave={e => e.currentTarget.style.color = "rgba(245,240,255,0.45)"}>
                  {l}
                </a>
              ))}
            </div>

            {/* Legal */}
            <div>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, letterSpacing:"0.15em", textTransform:"uppercase", color:"rgba(245,240,255,0.3)", marginBottom:20 }}>Legal</div>
              {["Privacy Policy","Terms of Service","Refund Policy","Cookie Policy","WhatsApp Policy"].map(l => (
                <a key={l} href="#" style={{ display:"block", fontFamily:"'DM Sans',sans-serif", fontSize:13, color:"rgba(245,240,255,0.45)", marginBottom:12, textDecoration:"none", transition:"color 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.color = "#e91e8c"}
                  onMouseLeave={e => e.currentTarget.style.color = "rgba(245,240,255,0.45)"}>
                  {l}
                </a>
              ))}
            </div>
          </div>

          {/* Footer bottom */}
          <div style={{
            borderTop:"1px solid rgba(255,255,255,0.06)",
            paddingTop:24,
            display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12,
          }}>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:"rgba(245,240,255,0.25)" }}>
              © 2025 Pilupoo. Built with ❤️ in Bangalore, India.
            </p>
            <div style={{ display:"flex", gap:4, alignItems:"center" }}>
              <div style={{ width:6, height:6, borderRadius:"50%", background:"#22c55e", animation:"pulse-ring 2s infinite" }}/>
              <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:"rgba(245,240,255,0.25)" }}>All systems operational</span>
            </div>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:"rgba(245,240,255,0.25)" }}>
              పిలుపు — Invitation in Telugu 🙏
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}