import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!agree) {
      setError("Please accept the terms and conditions");
      return;
    }

    try {
      await register(name, email, password);

      alert("Registration successful! Please login.");

      navigate("/login");
    } catch (err) {
      setError(err.response?.data || "Registration failed");
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-bg-blob" />

      <div className="auth-header signup-header">
        <div className="auth-header-text center-align">
          <p className="auth-greeting">Welcome,</p>
          <h1 className="auth-title">Sign Up!</h1>
        </div>
      </div>

      <div className="auth-body">
        <div className="auth-container">
          {error && <div className="error-msg">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="field-group">
              <label>User Name</label>
              <input
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="field-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
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
                  placeholder="Enter your password"
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

            <div className="terms-row">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                />

                <span className="checkmark" />

                <span>
                  I accept the <Link to="#">policy and terms</Link>
                </span>
              </label>
            </div>

            <button type="submit" className="auth-btn">
              Sign Up
            </button>
          </form>

          <div className="social-divider">
            <span>Or sign up with</span>
          </div>

          <div className="social-icons-row">
            <span className="social-circle fb-icon">f</span>
            <span className="social-circle google-icon">G</span>
            <span className="social-circle twitter-icon">𝕏</span>
          </div>

          <div className="auth-footer-text">
            Already have an account?{" "}
            <Link to="/login">Log In</Link>
          </div>
        </div>
      </div>
    </div>
  );
}