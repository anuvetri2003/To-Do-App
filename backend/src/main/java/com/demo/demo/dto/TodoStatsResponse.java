package com.demo.demo.dto;

public class TodoStatsResponse {

    private long total;
    private long todo;
    private long inProgress;
    private long completed;

    public TodoStatsResponse() {}

    public TodoStatsResponse(long total, long todo, long inProgress, long completed) {
        this.total = total;
        this.todo = todo;
        this.inProgress = inProgress;
        this.completed = completed;
    }

    public long getTotal() { return total; }
    public void setTotal(long total) { this.total = total; }

    public long getTodo() { return todo; }
    public void setTodo(long todo) { this.todo = todo; }

    public long getInProgress() { return inProgress; }
    public void setInProgress(long inProgress) { this.inProgress = inProgress; }

    public long getCompleted() { return completed; }
    public void setCompleted(long completed) { this.completed = completed; }
}
