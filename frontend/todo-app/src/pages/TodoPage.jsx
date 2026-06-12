import { useState, useEffect, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import KanbanColumn from "../components/KanbanColumn";
import TaskCard from "../components/TaskCard";
import AddTaskModal from "../components/AddTaskModal";

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

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const loadTasks = useCallback(async () => {
    try {
      const res = await api.get("/todos");
      setTasks(res.data);
    } catch {
      // handled by interceptor
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const getFilteredTasks = (status) => {
    let filtered = tasks.filter((t) => t.status === status);

    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.task.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q))
      );
    }

    return filtered;
  };

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
    } catch {
      loadTasks();
    }
  };

  const addTask = async (data) => {
    try {
      await api.post("/todos", data);
      setShowModal(false);
      loadTasks();
    } catch (err) {
      console.error("Failed to add task:", err);
      alert("Failed to add task. Check console for details.");
    }
  };

  const deleteTask = async (id) => {
    await api.delete(`/todos/${id}`);
    loadTasks();
  };

  const moveForwardTask = async (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "IN_PROGRESS" } : t))
    );
    try {
      await api.patch(`/todos/${id}/status`, { status: "IN_PROGRESS" });
    } catch (err) {
      console.error("Failed to move task forward:", err);
      loadTasks();
    }
  };

  const moveBackTask = async (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "TODO" } : t))
    );
    try {
      await api.patch(`/todos/${id}/status`, { status: "TODO" });
    } catch (err) {
      console.error("Failed to move task back:", err);
      loadTasks();
    }
  };

  const completeTask = async (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "COMPLETED" } : t))
    );
    try {
      await api.patch(`/todos/${id}/status`, { status: "COMPLETED" });
    } catch (err) {
      console.error("Failed to complete task:", err);
      loadTasks();
    }
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <main className="main-content">
        <div className="breadcrumb">
          Dashboard &gt; <span>Overview</span>
        </div>

        <div className="page-header">
          <h1>My Todo</h1>
          <button className="btn-new-task" onClick={() => setShowModal(true)}>
            + New Task
          </button>
        </div>

        <div className="toolbar">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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