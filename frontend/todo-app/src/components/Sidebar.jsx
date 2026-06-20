import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">ToDo</div>

      <nav className="sidebar-nav">
        <div className="sidebar-item active">
          <span className="icon">📊</span>
          Dashboard
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="sidebar-user-info">
            <div className="name">{user?.name}</div>
            <div className="email">{user?.email}</div>
          </div>
          <button
            style={{
              background: "none",
              border: "none",
              color: "rgba(255,255,255,0.5)",
              cursor: "pointer",
              fontSize: "13px",
              padding: "4px 8px",
              whiteSpace: "nowrap",
            }}
            onClick={() => { logout(); navigate("/login"); }}
          >
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
