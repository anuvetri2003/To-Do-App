package com.demo.demo.controller;

import com.demo.demo.dto.TodoDTO;
import com.demo.demo.dto.TodoRequest;
import com.demo.demo.dto.TodoStatsResponse;
import com.demo.demo.exception.BadRequestException;
import com.demo.demo.exception.ResourceNotFoundException;
import com.demo.demo.model.Todo;
import com.demo.demo.model.TodoStatus;
import com.demo.demo.model.User;
import com.demo.demo.repository.TodoRepository;
import com.demo.demo.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/todos")
@CrossOrigin(origins = "*")
public class TodoController {

    @Autowired
    private TodoRepository todoRepo;

    @Autowired
    private UserRepository userRepo;

    private User getUser(UserDetails userDetails) {
        if (userDetails == null) return null;
        return userRepo.findByEmail(userDetails.getUsername()).orElse(null);
    }

    @GetMapping
    public ResponseEntity<?> getAll(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "dueDate") String sort,
            @RequestParam(defaultValue = "asc") String direction,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {

        User user = getUser(userDetails);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        }

        Specification<Todo> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("user"), user));

            if (keyword != null && !keyword.isBlank()) {
                String pattern = "%" + keyword.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("task")), pattern),
                        cb.like(cb.lower(root.get("description")), pattern)
                ));
            }

            if (status != null && !status.isBlank()) {
                predicates.add(cb.equal(root.get("status"), TodoStatus.valueOf(status.toUpperCase())));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Sort sortObj = direction.equalsIgnoreCase("desc")
                ? Sort.by(sort).descending()
                : Sort.by(sort).ascending();

        Pageable pageable = PageRequest.of(page, size, sortObj);
        Page<Todo> todoPage = todoRepo.findAll(spec, pageable);

        Page<TodoDTO> dtoPage = todoPage.map(this::toDTO);
        return ResponseEntity.ok(dtoPage);
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats(@AuthenticationPrincipal UserDetails userDetails) {
        User user = getUser(userDetails);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        }

        long total = todoRepo.countByUser(user);
        long todo = todoRepo.countByUserAndStatus(user, TodoStatus.TODO);
        long inProgress = todoRepo.countByUserAndStatus(user, TodoStatus.IN_PROGRESS);
        long completed = todoRepo.countByUserAndStatus(user, TodoStatus.COMPLETED);

        return ResponseEntity.ok(new TodoStatsResponse(total, todo, inProgress, completed));
    }

    @PostMapping
    public ResponseEntity<?> add(
            @Valid @RequestBody TodoRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        User user = getUser(userDetails);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        }

        Todo todo = new Todo();
        todo.setTask(request.getTask());
        todo.setDescription(request.getDescription());
        if (request.getDueDate() != null) todo.setDueDate(request.getDueDate());
        todo.setStatus(request.getStatus() != null ? request.getStatus() : TodoStatus.TODO);
        todo.setUser(user);

        Todo saved = todoRepo.save(todo);
        return ResponseEntity.ok(toDTO(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(
            @PathVariable Long id,
            @Valid @RequestBody TodoRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        User user = getUser(userDetails);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        }

        Todo todo = todoRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Todo not found"));

        if (!todo.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Not authorized");
        }

        todo.setTask(request.getTask());
        if (request.getDescription() != null) todo.setDescription(request.getDescription());
        if (request.getDueDate() != null) todo.setDueDate(request.getDueDate());
        if (request.getStatus() != null) todo.setStatus(request.getStatus());

        return ResponseEntity.ok(toDTO(todoRepo.save(todo)));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserDetails userDetails) {

        User user = getUser(userDetails);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        }

        Todo todo = todoRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Todo not found"));

        if (!todo.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Not authorized");
        }

        String statusStr = body.get("status");
        if (statusStr == null || statusStr.isBlank()) {
            throw new BadRequestException("Status is required");
        }

        todo.setStatus(TodoStatus.valueOf(statusStr.toUpperCase()));
        return ResponseEntity.ok(toDTO(todoRepo.save(todo)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        User user = getUser(userDetails);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        }

        Todo todo = todoRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Todo not found"));

        if (!todo.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Not authorized");
        }

        todoRepo.deleteById(id);
        return ResponseEntity.ok().build();
    }

    private TodoDTO toDTO(Todo todo) {
        return new TodoDTO(
                todo.getId(),
                todo.getTask(),
                todo.getDescription(),
                todo.getDueDate(),
                todo.getStatus().name(),
                todo.getCreatedAt(),
                todo.getUpdatedAt(),
                todo.getUser().getId()
        );
    }
}
