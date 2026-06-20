package com.demo.demo.repository;

import com.demo.demo.model.Todo;
import com.demo.demo.model.TodoStatus;
import com.demo.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface TodoRepository extends JpaRepository<Todo, Long>, JpaSpecificationExecutor<Todo> {
    List<Todo> findByUserOrderByDueDateAsc(User user);
    long countByUser(User user);
    long countByUserAndStatus(User user, TodoStatus status);
}
