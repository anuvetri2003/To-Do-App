import { Link } from "react-router-dom";

export default function WelcomePage() {
  return (
    <div className="auth-screen">
      <div className="auth-bg-blob" />

      <div className="welcome-header">
        <div className="welcome-illustration">
          <div className="illustration-circle">
            <div className="ill-head" />
            <div className="ill-body" />
            <div className="ill-steering" />
          </div>
        </div>
        <h1 className="welcome-title">Driving Learning</h1>
        <div className="wave-divider">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path d="M0,120 C360,0 1080,0 1440,120 L1440,120 L0,120 Z" fill="#f5f0ff" />
          </svg>
        </div>
      </div>

      <div className="welcome-content">
        <h2 className="welcome-heading">Welcome</h2>
        <p className="welcome-subtitle">Get started with your tasks</p>

        <Link to="/signup" className="social-btn facebook-btn">
          <span className="social-icon fb-icon">f</span>
          Create Account
        </Link>

        <p className="alt-login">
          <Link to="/login">I already have an account</Link>
        </p>

        <div className="social-icons-row">
          <span className="social-circle fb-icon">f</span>
          <span className="social-circle google-icon">G</span>
          <span className="social-circle twitter-icon">𝕏</span>
        </div>
      </div>
    </div>
  );
}