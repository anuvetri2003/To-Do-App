package com.demo.demo.dto;

import com.demo.demo.model.TodoStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public class TodoRequest {

    @NotBlank(message = "Task title is required")
    @Size(max = 255, message = "Task title must be at most 255 characters")
    private String task;

    @Size(max = 500, message = "Description must be at most 500 characters")
    private String description;

    private LocalDate dueDate;

    private TodoStatus status;

    public String getTask() { return task; }
    public void setTask(String task) { this.task = task; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public TodoStatus getStatus() { return status; }
    public void setStatus(TodoStatus status) { this.status = status; }
}
