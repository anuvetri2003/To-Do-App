import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import WelcomePage from "./pages/WelcomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import TodoPage from "./pages/TodoPage";
import MobileTodo from "./pages/MobileTodo";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/welcome" />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/todos" /> : children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/welcome" element={<PublicRoute><WelcomePage /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
      <Route path="/todos" element={<ProtectedRoute><TodoPage /></ProtectedRoute>} />
      <Route path="/mobile-todo" element={<ProtectedRoute><MobileTodo /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
