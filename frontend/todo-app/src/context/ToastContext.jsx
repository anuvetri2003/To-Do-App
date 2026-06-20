import { createContext, useContext, useState, useCallback, useMemo } from "react";

const ToastContext = createContext();

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info") => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const success = useCallback((msg) => addToast(msg, "success"), [addToast]);
  const error = useCallback((msg) => addToast(msg, "error"), [addToast]);
  const info = useCallback((msg) => addToast(msg, "info"), [addToast]);

  const value = useMemo(() => ({ success, error, info }), [success, error, info]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            <span className="toast-icon">
              {t.type === "success" ? "✓" : t.type === "error" ? "✕" : "ℹ"}
            </span>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
