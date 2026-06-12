import { useState } from "react";

const STATUS_OPTIONS = [
  { value: "TODO", label: "To Start" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
];

export default function AddTaskModal({ onClose, onSave }) {
  const [task, setTask] = useState("");
  const [status, setStatus] = useState("TODO");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!task.trim()) return;
    onSave({ task: task.trim(), status });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Create New Task</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Task Title</label>
            <input
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Enter task title"
              required
              autoFocus
            />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}