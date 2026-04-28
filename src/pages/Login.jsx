import { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";

/* ─── Bubble animation keyframes injected once ─── */
const bubbleStyles = `
  @keyframes floatUp {
    0%   { top: 105%; opacity: 0.8; }
    100% { transform: translate3d(0, 0, 1px) translateY(-130vh); opacity: 0; }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

export default function Login() {
  const navigate  = useNavigate();
  const location  = useLocation();

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(location.state?.message || "");

  /* inject keyframes into document head once */
  useEffect(() => {
    const id = "unicrib-bubble-keyframes";
    if (!document.getElementById(id)) {
      const tag = document.createElement("style");
      tag.id = id;
      tag.textContent = bubbleStyles;
      document.head.appendChild(tag);
    }
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate("/dashboard");
    });
  }, [navigate]);

  const handleLogin = async () => {
    setError("");
    setSuccess("");

    if (!email.trim() || !password) {
      setError("Please fill in both fields.");
      return;
    }

    setLoading(true);

    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email:    email.trim(),
      password: password.trim(),
    });

    if (loginError) {
      setError(loginError.message);
      setLoading(false);
      return;
    }

    const user = data.user;
    if (!user) {
      setError("Login failed. Please try again.");
      setLoading(false);
      return;
    }

    const { error: profileError } = await supabase
      .from("user_profiles")
      .select("role_id")
      .eq("id", user.id)
      .single();

    if (profileError) {
      setError("Could not fetch user role. Please try again.");
      setLoading(false);
      return;
    }

    setLoading(false);
    navigate("/dashboard");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  /* 10 bubble configs matching original CSS */
  const bubbles = [
    { width: 40,  height: 40,  left: "5%",  duration: "9s",  delay: "0s"   },
    { width: 40,  height: 40,  left: "10%", duration: "17s", delay: "0s"   },
    { width: 40,  height: 40,  left: "20%", duration: "10s", delay: "8s"   },
    { width: 40,  height: 40,  left: "30%", duration: "7s",  delay: "7s"   },
    { width: 35,  height: 35,  left: "40%", duration: "10s", delay: "0s"   },
    { width: 50,  height: 50,  left: "50%", duration: "6s",  delay: "0s"   },
    { width: 20,  height: 20,  left: "60%", duration: "12s", delay: "4.5s" },
    { width: 30,  height: 30,  left: "80%", duration: "8s",  delay: "0s"   },
    { width: 25,  height: 25,  left: "85%", duration: "20s", delay: "0s"   },
    { width: 50,  height: 50,  left: "95%", duration: "15s", delay: "6s"   },
  ];

  return (
    <div style={S.page}>

      {/* ── BUBBLE BACKGROUND ── */}
      <div style={S.bubblesWrapper}>
        {bubbles.map((b, i) => (
          <span
            key={i}
            style={{
              ...S.bubble,
              width:           b.width,
              height:          b.height,
              left:            b.left,
              animationDuration: b.duration,
              animationDelay:  b.delay,
            }}
          />
        ))}
      </div>

      {/* ── LEFT PANEL ── */}
      <div style={S.leftPanel}>
        <div style={S.leftContent}>
          <div style={S.leftLogo}>🏠 UniCrib</div>
          <h2 style={S.leftHeading}>Welcome back</h2>
          <p style={S.leftSub}>
            Log in to browse verified accommodation, track your bookings, and pay your deposit — all in one place.
          </p>

          <div style={S.testimonial}>
            <p style={S.testimonialText}>
              "UniCrib helped me find a room near HIT in just two days. The whole process was smooth and I felt safe the entire time."
            </p>
            <div style={S.testimonialAuthor}>
              <div style={S.testimonialAvatar}>TM</div>
              <div>
                <p style={S.testimonialName}>Tatenda Moyo</p>
                <p style={S.testimonialRole}>Software Engineering · HIT, Year 2</p>
              </div>
            </div>
          </div>
        </div>
        <div style={S.leftImg} />
      </div>

      {/* ── RIGHT PANEL ── */}
      <div style={S.rightPanel}>
        <div style={S.formWrap}>

          <div style={S.formHeader}>
            <h1 style={S.formTitle}>Log in to your account</h1>
            <p style={S.formSub}>
              Don't have one?{" "}
              <Link to="/signup" style={S.inlineLink}>Create a free account →</Link>
            </p>
          </div>

          {/* success banner */}
          {success && (
            <div style={S.successBox}>✅ {success}</div>
          )}

          {/* error banner */}
          {error && (
            <div style={S.errorBox}>⚠ {error}</div>
          )}

          <div style={S.fields}>

            {/* email */}
            <div style={S.fieldGroup}>
              <label style={S.label}>Email address</label>
              <input
                style={S.input}
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="email"
              />
            </div>

            {/* password */}
            <div style={S.fieldGroup}>
              <div style={S.labelRow}>
                <label style={S.label}>Password</label>
                <button style={S.forgotBtn} type="button">Forgot password?</button>
              </div>
              <div style={S.pwWrap}>
                <input
                  style={{ ...S.input, paddingRight: "44px" }}
                  type={showPw ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoComplete="current-password"
                />
                <button
                  style={S.eyeBtn}
                  type="button"
                  onClick={() => setShowPw(p => !p)}
                >
                  {showPw ? "🙈" : "👁"}
                </button>
              </div>
            </div>

          </div>

          {/* submit */}
          <button
            style={{ ...S.loginBtn, ...(loading ? S.loginBtnLoading : {}) }}
            onClick={handleLogin}
            disabled={loading}
            type="button"
          >
            {loading ? (
              <span style={S.spinnerRow}>
                <span style={S.spinner} /> Logging in…
              </span>
            ) : "Log In →"}
          </button>

          {/* divider */}
          <div style={S.divider}>
            <div style={S.dividerLine} />
            <span style={S.dividerText}>New to UniCrib?</span>
            <div style={S.dividerLine} />
          </div>

          <Link to="/signup" style={{ textDecoration: "none" }}>
            <button style={S.signupBtn} type="button">
              Create a free account
            </button>
          </Link>

        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   STYLES
───────────────────────────────────────────── */
const S = {

  /* Page wrapper — must be relative + overflow hidden for bubbles */
  page: {
    display:    "flex",
    minHeight:  "100vh",
    fontFamily: "'Segoe UI', sans-serif",
    flexWrap:   "wrap",
    position:   "relative",
    overflow:   "hidden",
    background: "#000",          /* bubble canvas base */
  },

  /* ── Bubble background ── */
  bubblesWrapper: {
    position: "absolute",
    inset:    0,
    overflow: "hidden",
    zIndex:   0,
    pointerEvents: "none",
  },

  bubble: {
    borderRadius: "40px",
    top:          "105%",
    position:     "absolute",
    boxShadow:    "0 1vw 2vw 1vw #0159e4",
    animation:    "floatUp linear infinite",
  },

  /* ── Left panel ── */
  leftPanel: {
    width:      "100%",
    maxWidth:   "420px",
    minWidth:   "300px",
    background: "rgba(59,7,100,0.70)",
    backdropFilter:         "blur(14px)",
    WebkitBackdropFilter:   "blur(14px)",
    borderRight: "1px solid rgba(255,255,255,0.10)",
    display:        "flex",
    flexDirection:  "column",
    justifyContent: "space-between",
    padding:  "48px 32px 0",
    overflow: "hidden",
    position: "relative",
    zIndex:   1,
    boxSizing:"border-box",
    flex:     "1 1 360px",
  },

  leftContent: {
    position: "relative",
    zIndex:   2,
  },

  leftLogo: {
    fontSize:     "22px",
    fontWeight:   900,
    color:        "white",
    marginBottom: "48px",
  },

  leftHeading: {
    fontSize:      "34px",
    fontWeight:    900,
    color:         "white",
    lineHeight:    1.2,
    margin:        "0 0 14px",
    letterSpacing: "-0.5px",
  },

  leftSub: {
    fontSize:     "15px",
    color:        "rgba(255,255,255,0.65)",
    lineHeight:   1.7,
    margin:       "0 0 48px",
  },

  testimonial: {
    background:   "rgba(255,255,255,0.10)",
    border:       "1px solid rgba(255,255,255,0.18)",
    borderRadius: "16px",
    padding:      "24px",
  },

  testimonialText: {
    fontSize:   "15px",
    color:      "rgba(255,255,255,0.88)",
    lineHeight: 1.7,
    margin:     "0 0 20px",
    fontStyle:  "italic",
  },

  testimonialAuthor: {
    display:    "flex",
    alignItems: "center",
    gap:        "12px",
    flexWrap:   "wrap",
  },

  testimonialAvatar: {
    width:          "38px",
    height:         "38px",
    borderRadius:   "50%",
    background:     "rgba(255,255,255,0.22)",
    color:          "white",
    fontSize:       "13px",
    fontWeight:     800,
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    flexShrink:     0,
  },

  testimonialName: {
    margin:     0,
    fontSize:   "14px",
    fontWeight: 700,
    color:      "white",
  },

  testimonialRole: {
    margin:   0,
    fontSize: "12px",
    color:    "rgba(255,255,255,0.55)",
  },

  leftImg: {
    height:       "200px",
    background:   "url(https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=80) center/cover",
    borderRadius: "16px 16px 0 0",
    marginTop:    "40px",
    opacity:      0.45,
  },

  /* ── Right panel ── */
  rightPanel: {
    flex:     "1 1 420px",
    minWidth: 0,
    background:           "rgba(250,249,255,0.10)",
    backdropFilter:       "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    padding:        "48px 20px",
    overflowY:      "auto",
    boxSizing:      "border-box",
    position:       "relative",
    zIndex:         1,
  },

  formWrap: {
    width:    "100%",
    maxWidth: "440px",
  },

  formHeader: {
    marginBottom: "28px",
  },

  formTitle: {
    fontSize:      "28px",
    fontWeight:    900,
    color:         "#ffffff",
    margin:        "0 0 8px",
    letterSpacing: "-0.5px",
  },

  formSub: {
    fontSize:   "14px",
    color:      "rgba(255,255,255,0.55)",
    margin:     0,
    lineHeight: 1.5,
  },

  inlineLink: {
    color:          "#c4b5fd",
    fontWeight:     700,
    textDecoration: "none",
  },

  /* banners */
  successBox: {
    background:   "rgba(240,253,244,0.15)",
    border:       "1px solid rgba(187,247,208,0.4)",
    borderRadius: "10px",
    padding:      "12px 16px",
    color:        "#86efac",
    fontSize:     "14px",
    marginBottom: "20px",
  },

  errorBox: {
    background:   "rgba(254,242,242,0.15)",
    border:       "1px solid rgba(252,165,165,0.4)",
    borderRadius: "10px",
    padding:      "12px 16px",
    color:        "#fca5a5",
    fontSize:     "14px",
    marginBottom: "20px",
  },

  /* fields */
  fields: {
    display:       "flex",
    flexDirection: "column",
    gap:           "18px",
    marginBottom:  "24px",
  },

  fieldGroup: {
    display:       "flex",
    flexDirection: "column",
    gap:           "6px",
  },

  label: {
    fontSize:   "13px",
    fontWeight: 700,
    color:      "rgba(255,255,255,0.80)",
  },

  labelRow: {
    display:        "flex",
    justifyContent: "space-between",
    alignItems:     "center",
    gap:            "10px",
    flexWrap:       "wrap",
  },

  forgotBtn: {
    background: "none",
    border:     "none",
    color:      "#c4b5fd",
    fontSize:   "13px",
    fontWeight: 600,
    cursor:     "pointer",
    padding:    0,
  },

  input: {
    padding:      "12px 14px",
    borderRadius: "10px",
    border:       "1.5px solid rgba(255,255,255,0.20)",
    fontSize:     "14px",
    outline:      "none",
    background:   "rgba(255,255,255,0.10)",
    color:        "#ffffff",
    width:        "100%",
    boxSizing:    "border-box",
    fontFamily:   "inherit",
  },

  pwWrap: {
    position: "relative",
  },

  eyeBtn: {
    position:  "absolute",
    right:     "12px",
    top:       "50%",
    transform: "translateY(-50%)",
    background:"none",
    border:    "none",
    cursor:    "pointer",
    fontSize:  "16px",
    padding:   0,
  },

  /* login button */
  loginBtn: {
    width:        "100%",
    padding:      "14px",
    borderRadius: "12px",
    border:       "none",
    background:   "linear-gradient(135deg,#7c3aed,#4f46e5)",
    color:        "white",
    fontWeight:   800,
    fontSize:     "16px",
    cursor:       "pointer",
    marginBottom: "24px",
    boxShadow:    "0 0 28px rgba(124,58,237,0.45)",
  },

  loginBtnLoading: {
    opacity: 0.65,
    cursor:  "not-allowed",
  },

  spinnerRow: {
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    gap:            "10px",
  },

  spinner: {
    width:        "16px",
    height:       "16px",
    border:       "2px solid rgba(255,255,255,0.4)",
    borderTop:    "2px solid white",
    borderRadius: "50%",
    display:      "inline-block",
    animation:    "spin 0.7s linear infinite",
  },

  /* divider */
  divider: {
    display:      "flex",
    alignItems:   "center",
    gap:          "12px",
    marginBottom: "16px",
  },

  dividerLine: {
    flex:       1,
    height:     "1px",
    background: "rgba(255,255,255,0.15)",
  },

  dividerText: {
    fontSize:   "13px",
    color:      "rgba(255,255,255,0.35)",
    whiteSpace: "nowrap",
  },

  /* signup cta */
  signupBtn: {
    width:        "100%",
    padding:      "13px",
    borderRadius: "12px",
    border:       "1.5px solid rgba(255,255,255,0.22)",
    background:   "rgba(255,255,255,0.08)",
    color:        "rgba(255,255,255,0.85)",
    fontWeight:   700,
    fontSize:     "15px",
    cursor:       "pointer",
  },
};
