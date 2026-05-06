// "use client";

// import { useEffect, useRef, useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import {
//   useVerifyOtpMutation,
//   useResendOtpMutation,
// } from "@/store/apiSlice";
// type Purpose = "signup" | "forgot-password";
// export default function VerifyPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const email = searchParams.get("email");
//   const purpose = searchParams.get("purpose") as Purpose;
//   const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
//   const [resendOtp, { isLoading: resendLoading }] =
//     useResendOtpMutation();

//   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
//   const [error, setError] = useState(false);
//   const [isVerified, setIsVerified] = useState(false);
//   const [timer, setTimer] = useState(40);
// const [resendCount, setResendCount] = useState(true);
//   const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
// useEffect(() => {
//   inputsRef.current[0]?.focus();
// }, []);
//   // ⏱️ TIMER
//   useEffect(() => {
//     if (timer === 0) return;

//     const interval = setInterval(() => {
//       setTimer((prev) => prev - 1);
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [timer]);
//   useEffect(() => {
//   const finalOtp = otp.join("");
//   if (finalOtp.length === 6 && !isLoading) {
//     handleVerify();
//   }
// }, [otp]);

//   const handleChange = (value: string, index: number) => {
//     if (!/^\d?$/.test(value)) return;

//     const newOtp = [...otp];
//     newOtp[index] = value;
//     setOtp(newOtp);

//     if (value && index < 5) {
//       inputsRef.current[index + 1]?.focus();
//     }
//   };
// const resetOtpState = () => {
//   setOtp(["", "", "", "", "", ""]);
//   inputsRef.current[0]?.focus();
// };
//   // ⬅️ BACKSPACE + ENTER
//   const handleKeyDown = (
//     e: React.KeyboardEvent<HTMLInputElement>,
//     index: number
//   ) => {
//     if (e.key === "Backspace") {
//       if (!otp[index] && index > 0) {
//         inputsRef.current[index - 1]?.focus();
//       }
//     }
//   };

//   // ✅ VERIFY OTP
// const handleVerify = async () => {
//   const finalOtp = otp.join("");

//   if (finalOtp.length < 6) {
//     setError(true);
//     return;
//   }

// try {
//   await verifyOtp({
//     email: email!,
//     otp: finalOtp,
//     purpose: purpose,
//   }).unwrap();

//   setIsVerified(true);
//   resetOtpState();

//   setTimeout(() => {
//     if (purpose === "signup") {
//       router.replace("/dashboard");
//     } else if (purpose === "forgot-password") {
//       router.replace(`/reset-new-password?email=${email}`);
//     }
//   }, 1000);

// } catch (err) {
//   setError(true);
//   resetOtpState();
// }
// };

//   // 🔁 RESEND OTP
// const handleResend = async () => {
//   try {
//     const res = await resendOtp({  email: email! , purpose:purpose }).unwrap();

//     // ✅ success case
//     setResendCount(true);
//     resetOtpState();
//     setTimer(40);

//   } catch (err: any) {
//     console.log(err);
//     if (err?.status === 429) {
//       setResendCount(false); 
//     }
//   }
// };
// const handleSkip = () => {
//   router.replace("/dashboard");
// };
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-red-100">
//       <div className="bg-white/70 backdrop-blur-lg p-10 rounded-2xl shadow-xl w-[380px] text-center">
        
//         {/* ✅ SUCCESS */}
//         {isVerified ? (
//           <div className="text-green-600 font-semibold text-lg">
//             ✅ OTP Verified! Redirecting...
//           </div>
//         ) : (
//           <>
//             <h2 className="text-2xl font-bold text-pink-600 mb-2">
//               Verify OTP
//             </h2>

//             <p className="text-gray-600 mb-6 text-sm">
//               Sent to {email}
//             </p>

//             {/* OTP INPUT */}
//             <div className="flex justify-between mb-6">
//               {otp.map((digit, i) => (
//                 <input
//                   key={i}
//                  ref={(el) => {inputsRef.current[i] = el;}}
//                   type="text"
//                   maxLength={1}
//                   value={digit}
//                   onChange={(e) =>
//                     handleChange(e.target.value, i)
//                   }
//                   onKeyDown={(e) =>
//                     handleKeyDown(e, i)
//                   }
                  
//                   className={`w-12 h-12 text-center text-lg font-bold text-black rounded-lg border  
//                   ${
//                     error ? "border-red-500" : "border-gray-300"
//                   } 
//                   focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none`}
//                 />
//               ))}
//             </div>

//             {/* ERROR */}
//             {error && (
//               <p className="text-red-500 text-sm mb-4">
//                 Invalid OTP
//               </p>
//             )}

//             {/* VERIFY BUTTON */}
//             <button
//               onClick={handleVerify}
//               disabled={isLoading}
//               className="bg-gradient-to-r from-pink-500 to-red-500 text-white w-full py-3 rounded-lg shadow"
//             >
//               {isLoading ? "Verifying..." : "Verify 🚀"}
//             </button>

//             {/* RESEND */}
//           <div className="mt-4 text-sm">
//   {timer > 0 ? (
//     <p className="text-gray-500">
//       Resend OTP in {timer}s
//     </p>
//   ) : resendCount  ? (
//     <button
//       onClick={handleResend}
//       disabled={resendLoading}
//       className="text-pink-600 hover:underline"
//     >
//       {resendLoading ? "Sending..." : "Resend OTP"}
//     </button>
//   ) : (
//     <div className="space-y-2">
//       <p className="text-gray-500 text-sm">
//         Not getting OTP?
//       </p>

//       <button
//         onClick={handleSkip}
//         className="text-blue-600 font-medium hover:underline"
//       >
//         Continue Anyway →
//       </button>
//     </div>
//   )}
// </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useVerifyOtpMutation, useResendOtpMutation } from "@/store/apiSlice";

type Purpose = "signup" | "forgot-password";

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const purpose = searchParams.get("purpose") as Purpose;

  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: resendLoading }] = useResendOtpMutation();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [timer, setTimer] = useState(40);
  const [resendCount, setResendCount] = useState(true);
  const [mounted, setMounted] = useState(false);

  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    setMounted(true);
    inputsRef.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    const finalOtp = otp.join("");
    if (finalOtp.length === 6 && !isLoading) {
      handleVerify();
    }
  }, [otp]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputsRef.current[index + 1]?.focus();
  };

  const resetOtpState = () => {
    setOtp(["", "", "", "", "", ""]);
    inputsRef.current[0]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const finalOtp = otp.join("");
    if (finalOtp.length < 6) { setError(true); return; }

    try {
      await verifyOtp({ email: email!, otp: finalOtp, purpose }).unwrap();
      setIsVerified(true);
      resetOtpState();
      setTimeout(() => {
        if (purpose === "signup") router.replace("/dashboard");
        else if (purpose === "forgot-password") router.replace(`/reset-new-password?email=${email}`);
      }, 1500);
    } catch (err) {
      setError(true);
      resetOtpState();
    }
  };

  const handleResend = async () => {
    try {
      await resendOtp({ email: email!, purpose }).unwrap();
      setResendCount(true);
      resetOtpState();
      setTimer(40);
    } catch (err: any) {
      if (err?.status === 429) setResendCount(false);
    }
  };

  const handleSkip = () => router.replace("/dashboard");

  const timerPct = (timer / 40) * 100;
  const circumference = 2 * Math.PI * 20;

  return (
    <div
      style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        background: "#0d0810",
        color: "#f5f0ff",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0d0810; }
        ::-webkit-scrollbar-thumb { background: #e91e8c; border-radius: 2px; }

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

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes fall {
          0%   { transform: translateY(-20px); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 1; }
        }

        @keyframes pop-in {
          0%   { transform: scale(0.8); opacity: 0; }
          60%  { transform: scale(1.08); }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes success-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(34,197,94,0.3); }
          50%       { box-shadow: 0 0 50px rgba(34,197,94,0.6); }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-6px); }
          40%       { transform: translateX(6px); }
          60%       { transform: translateX(-4px); }
          80%       { transform: translateX(4px); }
        }

        .shimmer-text {
          background: linear-gradient(90deg, #f5f0ff 0%, #e91e8c 30%, #ff9800 50%, #e91e8c 70%, #f5f0ff 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }

        .otp-input {
          width: 52px;
          height: 60px;
          text-align: center;
          font-size: 24px;
          font-weight: 700;
          font-family: 'DM Sans', sans-serif;
          color: #f5f0ff;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 14px;
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s, transform 0.15s;
          caret-color: #e91e8c;
        }
        .otp-input:focus {
          border-color: rgba(233,30,140,0.6);
          background: rgba(233,30,140,0.08);
          box-shadow: 0 0 0 3px rgba(233,30,140,0.15);
          transform: scale(1.05);
        }
        .otp-input.filled {
          border-color: rgba(233,30,140,0.4);
          background: rgba(233,30,140,0.06);
        }
        .otp-input.error {
          border-color: rgba(255,82,82,0.6);
          background: rgba(255,82,82,0.08);
          box-shadow: 0 0 0 3px rgba(255,82,82,0.12);
          animation: shake 0.4s ease;
        }
        .otp-input.success {
          border-color: rgba(34,197,94,0.6);
          background: rgba(34,197,94,0.08);
          box-shadow: 0 0 0 3px rgba(34,197,94,0.12);
        }

        .btn-primary {
          width: 100%;
          padding: 15px 20px;
          border-radius: 100px;
          background: linear-gradient(135deg, #e91e8c, #ff5252);
          color: white;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          font-size: 15px;
          border: none;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
          box-shadow: 0 4px 24px rgba(233,30,140,0.35);
          letter-spacing: 0.3px;
        }
        .btn-primary:hover:not(:disabled) {
          transform: scale(1.02);
          box-shadow: 0 8px 36px rgba(233,30,140,0.5);
        }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

        .link-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: #e91e8c;
          transition: opacity 0.2s;
          padding: 0;
        }
        .link-btn:hover { opacity: 0.75; text-decoration: underline; }

        .card-glass {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        .star {
          position: absolute;
          width: 2px;
          height: 12px;
          background: rgba(233,30,140,0.6);
          border-radius: 2px;
          filter: blur(0.5px);
          animation: fall linear infinite;
        }

        .success-card {
          animation: pop-in 0.5s ease both, success-glow 2s ease-in-out infinite;
        }

        .fadeUp-1 { animation: fadeUp 0.6s ease 0.0s both; }
        .fadeUp-2 { animation: fadeUp 0.6s ease 0.1s both; }
        .fadeUp-3 { animation: fadeUp 0.6s ease 0.2s both; }
        .fadeUp-4 { animation: fadeUp 0.6s ease 0.35s both; }
      `}</style>

      {/* ── Ambient bubbles ── */}
      {[
        { w: 500, h: 500, l: "-5%",  t: "-10%", c: "#e91e8c", d: 0,  dur: 18 },
        { w: 350, h: 350, r: "-5%",  b: "-5%",  c: "#ff5252", d: 5,  dur: 22 },
        { w: 250, h: 250, l: "60%",  t: "40%",  c: "#9c27b0", d: 9,  dur: 16 },
        { w: 180, h: 180, l: "15%",  t: "65%",  c: "#ff9800", d: 13, dur: 20 },
      ].map((b, i) => (
        <div key={i} style={{
          position: "absolute", borderRadius: "50%",
          width: b.w, height: b.h,
          left: (b as any).l, right: (b as any).r,
          top: (b as any).t, bottom: (b as any).b,
          background: b.c, filter: "blur(100px)", opacity: 0.1,
          animation: `floatBubble ${b.dur}s ease-in-out infinite`,
          animationDelay: `${b.d}s`, pointerEvents: "none",
        }} />
      ))}

      {/* ── Dot grid ── */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.04,
        backgroundImage: "radial-gradient(circle, #f5f0ff 1px, transparent 1px)",
        backgroundSize: "40px 40px", pointerEvents: "none",
      }} />

      {/* ── Falling stars ── */}
      {mounted && Array.from({ length: 18 }).map((_, i) => (
        <span key={i} className="star" style={{
          left: `${(i * 5.7 + Math.sin(i) * 8) % 100}%`,
          animationDelay: `${(i * 0.37) % 6}s`,
          animationDuration: `${7 + (i % 5)}s`,
        }} />
      ))}

      {/* ── Navbar ── */}
      <nav style={{
        position: "relative", zIndex: 10,
        padding: "18px 40px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}>
        <a href="/" style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 900, textDecoration: "none" }}>
          <span style={{ color: "#e91e8c" }}>పి</span>
          <span style={{ color: "#f5f0ff" }}>lupoo</span>
        </a>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(245,240,255,0.4)" }}>
          Check your inbox for the code
        </div>
      </nav>

      {/* ── Main ── */}
      <main style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        padding: "40px 24px 60px", position: "relative", zIndex: 10,
      }}>
        <div style={{ width: "100%", maxWidth: 420 }}>

          {isVerified ? (
            /* ── Success state ── */
            <div style={{ textAlign: "center" }}>
              <div
                className="success-card"
                style={{
                  width: 96, height: 96, borderRadius: "50%",
                  background: "rgba(34,197,94,0.12)",
                  border: "1px solid rgba(34,197,94,0.3)",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  fontSize: 44, marginBottom: 28,
                }}
              >
                ✅
              </div>
              <h2 style={{ fontSize: "clamp(28px,5vw,40px)", fontWeight: 900, marginBottom: 12 }}>
                <span style={{ color: "#22c55e" }}>Verified!</span>
              </h2>
              <p style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 15,
                color: "rgba(245,240,255,0.45)", lineHeight: 1.6,
              }}>
                Redirecting you now
                <span style={{ display: "inline-block", animation: "pulse-dot 1s infinite", marginLeft: 4 }}>…</span>
              </p>
            </div>
          ) : (
            <>
              {/* Eyebrow badge */}
              <div className="fadeUp-1" style={{ textAlign: "center", marginBottom: 24 }}>
                <div style={{
                  width: 72, height: 72, borderRadius: "50%",
                  background: "rgba(233,30,140,0.12)",
                  border: "1px solid rgba(233,30,140,0.25)",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  fontSize: 30, marginBottom: 20,
                }}>
                  📬
                </div>
                <div>
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    background: "rgba(233,30,140,0.12)",
                    border: "1px solid rgba(233,30,140,0.25)",
                    borderRadius: 100, padding: "6px 18px",
                    fontFamily: "'DM Sans', sans-serif", fontSize: 12,
                    color: "rgba(245,240,255,0.6)", letterSpacing: "0.02em",
                  }}>
                    <span>Code sent to</span>
                    <span style={{ color: "#e91e8c", fontWeight: 500 }}>{email}</span>
                  </div>
                </div>
              </div>

              {/* Headline */}
              <div className="fadeUp-2" style={{ textAlign: "center", marginBottom: 36 }}>
                <h1 style={{ fontSize: "clamp(34px,6vw,50px)", fontWeight: 900, lineHeight: 1.08, marginBottom: 10 }}>
                  <span className="shimmer-text">Enter your</span><br />
                  <span style={{ color: "rgba(245,240,255,0.85)", fontSize: "0.65em", fontWeight: 400, fontStyle: "italic" }}>
                    {purpose === "signup" ? "verification code" : "reset code"}
                  </span>
                </h1>
              </div>

              {/* Card */}
              <div className="card-glass fadeUp-3" style={{
                borderRadius: 24, padding: "36px 32px",
                boxShadow: "0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(233,30,140,0.08)",
              }}>

                {/* OTP inputs */}
                <div style={{ marginBottom: 28 }}>
                  <label style={{
                    display: "block",
                    fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500,
                    color: "rgba(245,240,255,0.4)", letterSpacing: "0.12em",
                    textTransform: "uppercase", marginBottom: 16, textAlign: "center",
                  }}>
                    6-digit code
                  </label>

                  <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => { inputsRef.current[i] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => { setError(false); handleChange(e.target.value, i); }}
                        onKeyDown={(e) => handleKeyDown(e, i)}
                        className={`otp-input ${error ? "error" : digit ? "filled" : ""}`}
                      />
                    ))}
                  </div>

                  {/* Error */}
                  {error && (
                    <div style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                      marginTop: 14,
                      fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#ff8a8a",
                    }}>
                      <span>⚠</span>
                      <span>Invalid OTP — please try again</span>
                    </div>
                  )}
                </div>

                {/* Verify button */}
                <button
                  className="btn-primary"
                  onClick={handleVerify}
                  disabled={isLoading || otp.join("").length < 6}
                >
                  {isLoading ? (
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                      <span style={{ display: "inline-block", animation: "pulse-dot 1s infinite" }}>●</span>
                      Verifying…
                    </span>
                  ) : (
                    "Verify Code →"
                  )}
                </button>

                {/* Divider */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0" }}>
                  <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "rgba(245,240,255,0.2)", letterSpacing: "0.1em" }}>
                    RESEND
                  </span>
                  <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
                </div>

                {/* Timer / Resend / Skip */}
                <div style={{ textAlign: "center" }}>
                  {timer > 0 ? (
                    /* Countdown ring */
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                      <div style={{ position: "relative", width: 52, height: 52 }}>
                        <svg width="52" height="52" style={{ transform: "rotate(-90deg)" }}>
                          <circle cx="26" cy="26" r="20" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
                          <circle
                            cx="26" cy="26" r="20" fill="none"
                            stroke="#e91e8c" strokeWidth="3"
                            strokeDasharray={circumference}
                            strokeDashoffset={circumference - (timerPct / 100) * circumference}
                            strokeLinecap="round"
                            style={{ transition: "stroke-dashoffset 1s linear" }}
                          />
                        </svg>
                        <div style={{
                          position: "absolute", inset: 0,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500,
                          color: "#e91e8c",
                        }}>
                          {timer}
                        </div>
                      </div>
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(245,240,255,0.3)" }}>
                        Resend available in {timer}s
                      </p>
                    </div>
                  ) : resendCount ? (
                    <button
                      className="link-btn"
                      onClick={handleResend}
                      disabled={resendLoading}
                      style={{ fontSize: 14 }}
                    >
                      {resendLoading ? (
                        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ animation: "pulse-dot 1s infinite", display: "inline-block" }}>●</span>
                          Sending…
                        </span>
                      ) : (
                        "Resend OTP →"
                      )}
                    </button>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(245,240,255,0.35)" }}>
                        Not receiving the code?
                      </p>
                      <button
                        className="link-btn"
                        onClick={handleSkip}
                        style={{ color: "rgba(245,240,255,0.5)", fontSize: 13 }}
                      >
                        Continue anyway →
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Trust badges */}
              <div className="fadeUp-4" style={{
                display: "flex", justifyContent: "center", gap: 24,
                marginTop: 28, flexWrap: "wrap",
              }}>
                {[
                  { icon: "🔐", text: "Code expires in 10 mins" },
                  { icon: "📩", text: "Check spam folder" },
                  { icon: "✅", text: "One-time use only" },
                ].map((badge) => (
                  <div key={badge.text} style={{
                    display: "flex", alignItems: "center", gap: 6,
                    fontFamily: "'DM Sans', sans-serif", fontSize: 11,
                    color: "rgba(245,240,255,0.25)", letterSpacing: "0.04em",
                  }}>
                    <span style={{ fontSize: 12 }}>{badge.icon}</span>
                    <span>{badge.text}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      {/* ── Footer ── */}
      <footer style={{
        position: "relative", zIndex: 10,
        borderTop: "1px solid rgba(255,255,255,0.05)",
        padding: "20px 40px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 8,
      }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "rgba(245,240,255,0.2)" }}>
          © 2025 Pilupoo. Built with ❤️ in Bangalore.
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} />
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "rgba(245,240,255,0.2)" }}>
            All systems operational
          </span>
        </div>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "rgba(245,240,255,0.2)" }}>
          పిలుపు — Invitation in Telugu 🙏
        </p>
      </footer>
    </div>
  );
}