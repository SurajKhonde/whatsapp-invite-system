// app/not-found.tsx
// Shown when any route doesn't exist

export default function NotFound() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .nf-page {
          min-height: 100vh; background: #0d0810;
          display: flex; align-items: center; justify-content: center;
          font-family: 'DM Sans', sans-serif;
          padding: 24px; position: relative; overflow: hidden;
        }
        .nf-blob {
          position: fixed; border-radius: 50%;
          filter: blur(120px); pointer-events: none;
          animation: nfFloat 18s ease-in-out infinite;
        }
        @keyframes nfFloat {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-28px); }
        }
        .nf-grid {
          position: fixed; inset: 0; pointer-events: none;
          background-image: radial-gradient(circle, rgba(245,240,255,0.025) 1px, transparent 1px);
          background-size: 36px 36px;
        }
        .nf-card {
          position: relative; z-index: 2;
          text-align: center; max-width: 500px; width: 100%;
        }
        .nf-big {
          font-family: 'Playfair Display', serif;
          font-size: clamp(100px, 18vw, 160px);
          font-weight: 900; line-height: 1;
          background: linear-gradient(135deg, #e91e8c, #ff5252);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 8px;
          animation: nfPulse 3s ease-in-out infinite;
        }
        @keyframes nfPulse {
          0%,100% { opacity: 1; } 50% { opacity: 0.7; }
        }
        .nf-title {
          font-size: 22px; font-weight: 700; color: #f5f0ff;
          margin-bottom: 12px;
        }
        .nf-desc {
          font-size: 14px; color: rgba(245,240,255,0.35);
          line-height: 1.7; margin-bottom: 36px;
          max-width: 360px; margin-left: auto; margin-right: auto;
        }
        .nf-actions { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
        .nf-btn-primary {
          padding: 12px 28px; border-radius: 12px; border: none;
          background: linear-gradient(135deg, #e91e8c, #ff5252);
          color: white; font-size: 14px; font-weight: 600;
          cursor: pointer; font-family: inherit; text-decoration: none;
          display: inline-flex; align-items: center; gap: 7px;
          transition: transform 0.15s, box-shadow 0.15s;
          box-shadow: 0 4px 18px rgba(233,30,140,0.3);
        }
        .nf-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(233,30,140,0.4); }
        .nf-btn-ghost {
          padding: 12px 22px; border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.03);
          color: rgba(245,240,255,0.5); font-size: 14px; font-weight: 500;
          text-decoration: none; display: inline-flex; align-items: center; gap: 7px;
          transition: all 0.15s; font-family: inherit;
        }
        .nf-btn-ghost:hover { border-color: rgba(233,30,140,0.3); color: #f5f0ff; }
        .nf-logo {
          margin-top: 48px; font-size: 18px; font-weight: 900;
          font-family: 'Playfair Display', serif;
          text-decoration: none;
        }
        .nf-logo .p    { color: #e91e8c; }
        .nf-logo .rest { color: rgba(245,240,255,0.3); }
      `}</style>

      <div className="nf-blob" style={{ width:500, height:500, left:"-15%", top:"-15%", background:"#e91e8c", opacity:"0.06" as any }} />
      <div className="nf-blob" style={{ width:300, height:300, right:"-8%",  bottom:"5%",  background:"#9c27b0", opacity:"0.05" as any, animationDelay:"7s" }} />
      <div className="nf-grid" />

      <div className="nf-card">
        <div className="nf-big">404</div>
        <h1 className="nf-title">Page not found</h1>
        <p className="nf-desc">
          The page you're looking for doesn't exist or was moved.
          Let's get you back on track.
        </p>
        <div className="nf-actions">
          <a href="/dashboard" className="nf-btn-primary">🏠 Go to Dashboard</a>
          <a href="/events"    className="nf-btn-ghost">📅 My Events</a>
        </div>
        <a href="/" className="nf-logo" style={{ display:"block", marginTop:48 }}>
          <span className="p">పి</span><span className="rest">lupoo</span>
        </a>
      </div>
    </>
  );
}