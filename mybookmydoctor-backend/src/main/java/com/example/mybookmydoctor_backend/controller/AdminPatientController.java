package com.example.mybookmydoctor_backend.controller;

import com.example.mybookmydoctor_backend.model.Patient;
import com.example.mybookmydoctor_backend.model.Role;
import com.example.mybookmydoctor_backend.model.User;
import com.example.mybookmydoctor_backend.repository.PatientRepository;
import com.example.mybookmydoctor_backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin/patients")
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AdminPatientController {

    private final PatientRepository patientRepo;
    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;

    public AdminPatientController(PatientRepository patientRepo,
                                  UserRepository userRepo,
                                  PasswordEncoder passwordEncoder) {
        this.patientRepo = patientRepo;
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public List<Patient> getAllPatients() {
        return patientRepo.findAll();
    }

    @PostMapping
    public ResponseEntity<?> addPatient(@RequestBody Patient patient) {
        if (patient.getUser() == null) {
            return ResponseEntity.badRequest().body("User details are required for patient creation.");
        }

        User user = patient.getUser();

        if (userRepo.existsByUsername(user.getUsername())) {
            return ResponseEntity.badRequest().body("Username already exists.");
        }

        if (user.getUsername() == null || user.getUsername().isEmpty()) {
            user.setUsername(user.getFullName().toLowerCase().replace(" ", "") + System.currentTimeMillis());
        }

        user.setPassword(passwordEncoder.encode("0000"));
        user.setRole(Role.ROLE_PATIENT);

        User savedUser = userRepo.save(user);
        patient.setUser(savedUser);
        Patient savedPatient = patientRepo.save(patient);

        return ResponseEntity.ok(savedPatient);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePatient(@PathVariable Long id, @RequestBody Patient updatedPatient) {
        return patientRepo.findById(id).map(existing -> {
            existing.setAddress(updatedPatient.getAddress());
            existing.setPhone(updatedPatient.getPhone());
            if (updatedPatient.getUser() != null && existing.getUser() != null) {
                User user = existing.getUser();
                user.setFullName(updatedPatient.getUser().getFullName());
                user.setEmail(updatedPatient.getUser().getEmail());
                userRepo.save(user);
            }
            return ResponseEntity.ok(patientRepo.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePatient(@PathVariable Long id) {
        return patientRepo.findById(id).map(patient -> {
            if (patient.getUser() != null) {
                userRepo.deleteById(patient.getUser().getId());
            }
            patientRepo.deleteById(id);
            return ResponseEntity.ok("Patient deleted successfully");
        }).orElse(ResponseEntity.notFound().build());
    }
}
