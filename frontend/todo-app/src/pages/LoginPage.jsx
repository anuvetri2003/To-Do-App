import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      await login(email, password);

      setSuccess("✅ Login Successful!");

      setTimeout(() => {
        navigate("/todos");
      }, 1500);
    } catch {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-bg-blob" />

      <div className="auth-header login-header">
        <div className="auth-header-text center-align">
          <p className="auth-greeting">Welcome Back,</p>
          <h1 className="auth-title">Log In!</h1>
        </div>
      </div>

      <div className="auth-body">
        <div className="auth-container">

          {error && <div className="error-msg">{error}</div>}

          {success && (
            <div className="success-msg">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="field-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="DUSKY.SAAD@GMAIL.COM"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="field-group">
              <label>Password</label>
              <div className="password-wrapper">
                <input
                  type={showPwd ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="pwd-toggle"
                  onClick={() => setShowPwd(!showPwd)}
                  tabIndex={-1}
                >
                  {showPwd ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div className="options-row">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <span className="checkmark" />
                <span>Remember me</span>
              </label>

              <Link to="#" className="forgot-link">
                Forgot Password?
              </Link>
            </div>

            <button type="submit" className="auth-btn">
              Login
            </button>
          </form>

          <div className="social-divider">
            <span>Or login with</span>
          </div>

          <div className="social-icons-row">
            <span className="social-circle fb-icon">f</span>
            <span className="social-circle google-icon">G</span>
            <span className="social-circle twitter-icon">𝕏</span>
          </div>

          <div className="auth-footer-text">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </div>

        </div>
      </div>
    </div>
  );
}