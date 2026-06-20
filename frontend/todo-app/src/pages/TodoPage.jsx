import { useState, useEffect, useCallback, useRef } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import api from "../services/api";
import { useToast } from "../context/ToastContext";
import Sidebar from "../components/Sidebar";
import KanbanColumn from "../components/KanbanColumn";
import TaskCard from "../components/TaskCard";
import AddTaskModal from "../components/AddTaskModal";
import LoadingSpinner from "../components/LoadingSpinner";

const COLUMNS = [
  { id: "TODO", title: "To Start" },
  { id: "IN_PROGRESS", title: "In Progress" },
  { id: "COMPLETED", title: "Completed" },
];

export default function TodoPage() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [activeTask, setActiveTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");
  const searchTimer = useRef(null);
  const mountedRef = useRef(true);

  const toast = useToast();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const loadTasks = useCallback(async (keyword) => {
    setLoading(true);
    try {
      const params = { size: 100 };
      if (keyword && keyword.trim()) params.keyword = keyword;
      const res = await api.get("/todos", { params });
      if (mountedRef.current) setTasks(res.data.content || res.data);
    } catch {
      if (mountedRef.current) toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadStats = useCallback(async () => {
    try {
      const res = await api.get("/todos/stats");
      if (mountedRef.current) setStats(res.data);
    } catch {
      // non-critical
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    loadTasks();
    loadStats();
    return () => { mountedRef.current = false; };
  }, []);

  const handleSearch = (value) => {
    setSearch(value);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      loadTasks(value);
    }, 400);
  };

  const getFilteredTasks = (status) =>
    tasks.filter((t) => t.status === status);

  const handleDragStart = (event) => {
    const task = event.active.data.current?.task;
    if (task) setActiveTask(task);
  };

  const handleDragEnd = async (event) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const taskId = Number(active.id);
    const targetCol = over.id;

    const validCols = ["TODO", "IN_PROGRESS", "COMPLETED"];
    if (!validCols.includes(targetCol)) return;

    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.status === targetCol) return;

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: targetCol } : t))
    );

    try {
      await api.patch(`/todos/${taskId}/status`, { status: targetCol });
      if (targetCol === "COMPLETED") toast.success("Task completed!");
      loadStats();
    } catch {
      loadTasks(search);
      toast.error("Failed to update status");
    }
  };

  const addTask = async (data) => {
    try {
      await api.post("/todos", data);
      setShowModal(false);
      toast.success("Task created successfully!");
      loadTasks(search);
      loadStats();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add task");
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/todos/${id}`);
      toast.success("Task deleted");
      loadTasks(search);
      loadStats();
    } catch (err) {
      toast.error("Failed to delete task");
    }
  };

  const moveForwardTask = async (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "IN_PROGRESS" } : t))
    );
    try {
      await api.patch(`/todos/${id}/status`, { status: "IN_PROGRESS" });
      loadStats();
    } catch (err) {
      loadTasks(search);
      toast.error("Failed to move task");
    }
  };

  const moveBackTask = async (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "TODO" } : t))
    );
    try {
      await api.patch(`/todos/${id}/status`, { status: "TODO" });
      loadStats();
    } catch (err) {
      loadTasks(search);
      toast.error("Failed to move task");
    }
  };

  const completeTask = async (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "COMPLETED" } : t))
    );
    try {
      await api.patch(`/todos/${id}/status`, { status: "COMPLETED" });
      toast.success("Task completed!");
      loadStats();
    } catch (err) {
      loadTasks(search);
      toast.error("Failed to complete task");
    }
  };

  return (
    <div className="dashboard">
      <LoadingSpinner loading={loading} />
      <Sidebar />
      <main className="main-content">
        <div className="breadcrumb">
          Dashboard &gt; <span>Overview</span>
        </div>

        <div className="page-header">
          <h1>My Todo</h1>
          <div className="page-header-actions">
            <button className="theme-toggle" onClick={() => setDark((d) => !d)}>
              {dark ? "☀️" : "🌙"}
            </button>
            <button className="btn-new-task" onClick={() => setShowModal(true)}>
              + New Task
            </button>
          </div>
        </div>

        {stats && (
          <div className="stats-row">
            <div className="stat-card"><span className="stat-num">{stats.total}</span> Total</div>
            <div className="stat-card stat-todo"><span className="stat-num">{stats.todo}</span> To Do</div>
            <div className="stat-card stat-progress"><span className="stat-num">{stats.inProgress}</span> In Progress</div>
            <div className="stat-card stat-done"><span className="stat-num">{stats.completed}</span> Completed</div>
          </div>
        )}

        <div className="toolbar">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>

        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="kanban-board">
            {COLUMNS.map((col) => (
              <KanbanColumn
                key={col.id}
                id={col.id}
                title={col.title}
                tasks={getFilteredTasks(col.id)}
                onDelete={deleteTask}
                onComplete={completeTask}
                onMoveBack={moveBackTask}
                onMoveForward={moveForwardTask}
                onAddNew={() => setShowModal(true)}
              />
            ))}
          </div>
          <DragOverlay>
            {activeTask && (
              <div className="drag-overlay">
                <TaskCard task={activeTask} onDelete={() => {}} onComplete={() => {}} />
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </main>

      {showModal && (
        <AddTaskModal
          onClose={() => setShowModal(false)}
          onSave={addTask}
        />
      )}
    </div>
  );
}
