import { useDroppable } from "@dnd-kit/core";
import TaskCard from "./TaskCard";

const COLORS = {
  TODO: "#4f6ef7",
  IN_PROGRESS: "#f5a623",
  COMPLETED: "#2ecc71",
};

export default function KanbanColumn({ id, title, tasks, onDelete, onComplete, onMoveBack, onMoveForward }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      className={`kanban-column ${isOver ? "droppable-over" : ""}`}
    >
      <div className="column-header">
        <span
          className="status-dot"
          style={{ background: COLORS[id] || "#636e72" }}
        />
        <h3>{title}</h3>
        <span className="task-count">{tasks.length}</span>
      </div>

      <div ref={setNodeRef} style={{ minHeight: 80 }}>
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onDelete={onDelete} onComplete={onComplete} onMoveBack={onMoveBack} onMoveForward={onMoveForward} />
        ))}
      </div>
    </div>
  );
}