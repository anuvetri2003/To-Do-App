package com.demo.demo.dto;

import com.demo.demo.model.TodoStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class TodoRequest {

    @NotBlank(message = "Task title is required")
    @Size(max = 255, message = "Task title must be at most 255 characters")
    private String task;

    private TodoStatus status;

    public String getTask() { return task; }
    public void setTask(String task) { this.task = task; }

    public TodoStatus getStatus() { return status; }
    public void setStatus(TodoStatus status) { this.status = status; }
}
