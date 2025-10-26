package com.example.mybookmydoctor_backend.controller;

import com.example.mybookmydoctor_backend.dto.*;
import com.example.mybookmydoctor_backend.model.*;
import com.example.mybookmydoctor_backend.repository.*;
import com.example.mybookmydoctor_backend.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authManager;
    private final UserRepository userRepo;
    private final DoctorRepository doctorRepo;
    private final PatientRepository patientRepo;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(AuthenticationManager authManager,
                          UserRepository userRepo,
                          DoctorRepository doctorRepo,
                          PatientRepository patientRepo,
                          BCryptPasswordEncoder passwordEncoder,
                          JwtUtil jwtUtil) {
        this.authManager = authManager;
        this.userRepo = userRepo;
        this.doctorRepo = doctorRepo;
        this.patientRepo = patientRepo;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest req) {
        if (userRepo.findByUsername(req.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("username already exists");
        }

        User user = new User();
        user.setUsername(req.getUsername());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setFullName(req.getFullName());
        user.setEmail(req.getEmail());
        user.setRole(req.getRole());

        user = userRepo.save(user);

        if (req.getRole() == Role.ROLE_DOCTOR) {
            Doctor doctor = new Doctor();
            doctor.setUser(user);
            doctor.setSpecialization("General");
            doctorRepo.save(doctor);
        } else if (req.getRole() == Role.ROLE_PATIENT) {
            Patient patient = new Patient();
            patient.setUser(user);
            patientRepo.save(patient);
        }

        return ResponseEntity.ok("user created");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest req) {
        try {
            Authentication auth = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword())
            );

            Optional<User> userOpt = userRepo.findByUsername(req.getUsername());
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(404).body("User not found");
            }

            User user = userOpt.get();
            String role = user.getRole().name();
            String token = jwtUtil.generateToken(user.getUsername(), role);

            return ResponseEntity.ok(new AuthResponse(token, user.getUsername(), role));
        } catch (AuthenticationException ex) {
            return ResponseEntity.status(401).body("invalid username/password");
        }
    }
}
