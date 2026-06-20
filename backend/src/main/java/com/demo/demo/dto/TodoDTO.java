package com.demo.demo.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class TodoDTO {

    private Long id;
    private String task;
    private String description;
    private LocalDate dueDate;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long userId;

    public TodoDTO() {}

    public TodoDTO(Long id, String task, String description, LocalDate dueDate,
                   String status, LocalDateTime createdAt, LocalDateTime updatedAt, Long userId) {
        this.id = id;
        this.task = task;
        this.description = description;
        this.dueDate = dueDate;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.userId = userId;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTask() { return task; }
    public void setTask(String task) { this.task = task; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
}
