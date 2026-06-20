package com.demo.demo.controller;

import com.demo.demo.dto.AuthRequest;
import com.demo.demo.dto.AuthResponse;
import com.demo.demo.dto.RegisterRequest;
import com.demo.demo.exception.BadRequestException;
import com.demo.demo.model.Role;
import com.demo.demo.model.User;
import com.demo.demo.repository.UserRepository;
import com.demo.demo.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin("*")
public class AuthController {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authManager;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        if (userRepo.findByEmail(request.getEmail()).isPresent()) {
            throw new BadRequestException("Email already exists");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);
        userRepo.save(user);

        String token = jwtUtil.generateToken(user.getEmail());
        return ResponseEntity.ok(new AuthResponse(token, user.getId(), user.getName(), user.getEmail()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest request) {
        try {
            authManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (AuthenticationException e) {
            throw new BadRequestException("Invalid email or password");
        }

        User user = userRepo.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("User not found"));

        String token = jwtUtil.generateToken(user.getEmail());
        return ResponseEntity.ok(new AuthResponse(token, user.getId(), user.getName(), user.getEmail()));
    }
}
