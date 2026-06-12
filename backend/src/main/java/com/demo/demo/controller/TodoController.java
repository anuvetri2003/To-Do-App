package com.demo.demo.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.demo.demo.model.Todo;
import com.demo.demo.model.TodoStatus;
import com.demo.demo.model.User;
import com.demo.demo.repository.TodoRepository;
import com.demo.demo.repository.UserRepository;

@RestController
@RequestMapping("/todos")
@CrossOrigin(origins = "*")
public class TodoController {

    @Autowired
    private TodoRepository todoRepo;

    @Autowired
    private UserRepository userRepo;

    private User getUser(UserDetails userDetails) {

        System.out.println("===== DEBUG USER =====");

        if (userDetails == null) {
            System.out.println("UserDetails is NULL");
            return null;
        }

        System.out.println("Logged User Email: " + userDetails.getUsername());

        User user = userRepo.findByEmail(userDetails.getUsername())
                .orElse(null);

        System.out.println("DB User Found: " + (user != null));

        return user;
    }

    @GetMapping
    public ResponseEntity<?> getAll(
            @AuthenticationPrincipal UserDetails userDetails) {

        System.out.println("GET /todos HIT");

        User user = getUser(userDetails);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("User not found");
        }

        return ResponseEntity.ok(
                todoRepo.findByUserOrderByDueDateAsc(user)
        );
    }

    @PostMapping
    public ResponseEntity<?> add(
            @RequestBody Todo todo,
            @AuthenticationPrincipal UserDetails userDetails) {

        System.out.println("POST /todos HIT");
        System.out.println("USER DETAILS = " + userDetails);

        User user = getUser(userDetails);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("User not found");
        }

        if (todo.getStatus() == null) {
            todo.setStatus(TodoStatus.TODO);
        }

        todo.setUser(user);

        Todo savedTodo = todoRepo.save(todo);

        System.out.println("TODO SAVED ID = " + savedTodo.getId());

        return ResponseEntity.ok(savedTodo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(
            @PathVariable Long id,
            @RequestBody Todo updated,
            @AuthenticationPrincipal UserDetails userDetails) {

        System.out.println("PUT /todos/" + id + " HIT");

        User user = getUser(userDetails);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("User not found");
        }

        Todo todo = todoRepo.findById(id).orElse(null);

        if (todo == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Todo not found");
        }

        if (!todo.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Not authorized");
        }

        todo.setTask(updated.getTask());

        if (updated.getDescription() != null)
            todo.setDescription(updated.getDescription());

        if (updated.getDueDate() != null)
            todo.setDueDate(updated.getDueDate());

        if (updated.getStatus() != null)
            todo.setStatus(updated.getStatus());

        return ResponseEntity.ok(todoRepo.save(todo));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserDetails userDetails) {

        System.out.println("PATCH /todos/" + id + "/status HIT");

        User user = getUser(userDetails);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("User not found");
        }

        Todo todo = todoRepo.findById(id).orElse(null);

        if (todo == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Todo not found");
        }

        if (!todo.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Not authorized");
        }

        todo.setStatus(TodoStatus.valueOf(body.get("status")));

        return ResponseEntity.ok(todoRepo.save(todo));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        System.out.println("DELETE /todos/" + id + " HIT");

        User user = getUser(userDetails);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("User not found");
        }

        Todo todo = todoRepo.findById(id).orElse(null);

        if (todo == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Todo not found");
        }

        if (!todo.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Not authorized");
        }

        todoRepo.deleteById(id);

        return ResponseEntity.ok().build();
    }
}