import { useState, useEffect, useCallback } from "react";
import api from "../services/api";

export default function MobileTodo() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");

  const loadTasks = useCallback(async () => {
    try {
      const res = await api.get("/todos");
      setTasks(
        res.data.map((t) => ({
          id: t.id,
          title: t.task,
          completed: t.status === "COMPLETED",
        }))
      );
    } catch {
      // handled by interceptor
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const addTask = async () => {
    if (!input.trim()) return;
    try {
      await api.post("/todos", { task: input.trim(), status: "TODO" });
      setInput("");
      loadTasks();
    } catch (err) {
      console.error("Failed to add task:", err);
    }
  };

  const toggleTask = async (id) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const newStatus = task.completed ? "TODO" : "COMPLETED";
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
    try {
      await api.patch(`/todos/${id}/status`, { status: newStatus });
    } catch {
      loadTasks();
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/todos/${id}`);
      loadTasks();
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  const clearCompleted = async () => {
    const completedTasks = tasks.filter((t) => t.completed);
    try {
      await Promise.all(completedTasks.map((t) => api.delete(`/todos/${t.id}`)));
      loadTasks();
    } catch (err) {
      console.error("Failed to clear completed:", err);
    }
  };

  return (
    <div className="mobile-todo">
      <div className="mobile-todo-container">
        <div className="mt-header">
          <span className="mt-logo-t">T</span>
          <span className="mt-logo-o1">O</span>
          <span className="mt-logo-d">D</span>
          <span className="mt-logo-o2">O</span>
        </div>

        <div className="mt-input-row">
          <input
            className="mt-input"
            placeholder="What do you need to do?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
          />
          <button className="mt-add-btn" onClick={addTask}>
            ADD
          </button>
        </div>

        <div className="mt-card">
          {tasks.map((task) => (
            <div key={task.id} className="mt-task">
              <div
                className={`mt-circle ${task.completed ? "checked" : ""}`}
                onClick={() => toggleTask(task.id)}
              >
                {task.completed && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <span className={`mt-task-title ${task.completed ? "done" : ""}`}>
                {task.title}
              </span>
              <button className="mt-delete" onClick={() => deleteTask(task.id)}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 4h12M5 4V2.5A.5.5 0 015.5 2h5a.5.5 0 01.5.5V4M13 4v9.5a1 1 0 01-1 1H4a1 1 0 01-1-1V4" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          ))}

          <div className="mt-footer" onClick={clearCompleted}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="3" width="12" height="10" rx="2" stroke="#f5a623" strokeWidth="1.5"/>
              <path d="M4 3V2a1 1 0 011-1h4a1 1 0 011 1v1" stroke="#f5a623" strokeWidth="1.5"/>
              <path d="M4 7l2 2 4-4" stroke="#f5a623" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Clear Completed</span>
          </div>
        </div>
      </div>
    </div>
  );
}
