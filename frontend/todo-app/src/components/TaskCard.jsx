import { useDraggable } from "@dnd-kit/core";

export default function TaskCard({ task, onDelete, onComplete, onMoveBack, onMoveForward }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: { task, column: task.status },
  });

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  return (
    <div
      className={`task-card ${isDragging ? "dragging" : ""}`}
      style={style}
    >
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        className="task-card-drag"
      >
        <h4>{task.task}</h4>
      </div>
      <div className="task-card-actions">
        {task.status === "TODO" && (
          <button
            className="task-forward-btn"
            onClick={() => onMoveForward(task.id)}
            title="Move to In Progress"
          >
            ▶
          </button>
        )}
        {task.status === "IN_PROGRESS" && (
          <button
            className="task-back-btn"
            onClick={() => onMoveBack(task.id)}
            title="Move back to TODO"
          >
            ◀
          </button>
        )}
        {task.status !== "COMPLETED" && (
          <button
            className="task-complete-btn"
            onClick={() => onComplete(task.id)}
            title="Mark complete"
          >
            ✓
          </button>
        )}
        <button
          className="task-delete-btn"
          onClick={() => onDelete(task.id)}
        >
          ✕
        </button>
      </div>
    </div>
  );
}