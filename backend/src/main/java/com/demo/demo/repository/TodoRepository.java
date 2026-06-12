package com.demo.demo.repository;

import com.demo.demo.model.Todo;
import com.demo.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TodoRepository extends JpaRepository<Todo, Long> {
    List<Todo> findByUserOrderByDueDateAsc(User user);
}