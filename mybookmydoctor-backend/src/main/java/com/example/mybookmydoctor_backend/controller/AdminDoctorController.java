package com.example.mybookmydoctor_backend.controller;

import com.example.mybookmydoctor_backend.model.Doctor;
import com.example.mybookmydoctor_backend.model.Role;
import com.example.mybookmydoctor_backend.model.User;
import com.example.mybookmydoctor_backend.repository.DoctorRepository;
import com.example.mybookmydoctor_backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin/doctors")
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AdminDoctorController {

    private final DoctorRepository doctorRepo;
    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;

    public AdminDoctorController(DoctorRepository doctorRepo, UserRepository userRepo, PasswordEncoder passwordEncoder) {
        this.doctorRepo = doctorRepo;
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public List<Doctor> getAllDoctors() {
        return doctorRepo.findAll();
    }

    @PostMapping
    public ResponseEntity<?> addDoctor(@RequestBody Doctor doctor) {
        if (doctor.getUser() == null || doctor.getUser().getUsername() == null) {
            return ResponseEntity.badRequest().body("Username is required.");
        }

        User user = doctor.getUser();
        if (userRepo.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists.");
        }

        user.setPassword(passwordEncoder.encode("0000"));
        user.setRole(Role.ROLE_DOCTOR);
        User savedUser = userRepo.save(user);

        doctor.setUser(savedUser);
        Doctor savedDoctor = doctorRepo.save(doctor);

        return ResponseEntity.ok(savedDoctor);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDoctor(@PathVariable Long id, @RequestBody Doctor updatedDoctor) {
        return doctorRepo.findById(id).map(existing -> {
            existing.setSpecialization(updatedDoctor.getSpecialization());
            if (updatedDoctor.getUser() != null) {
                User user = existing.getUser();
                user.setFullName(updatedDoctor.getUser().getFullName());
                user.setEmail(updatedDoctor.getUser().getEmail());
                userRepo.save(user);
            }
            return ResponseEntity.ok(doctorRepo.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDoctor(@PathVariable Long id) {
        return doctorRepo.findById(id).map(doc -> {
            if (doc.getUser() != null) {
                userRepo.deleteById(doc.getUser().getId());
            }
            doctorRepo.deleteById(id);
            return ResponseEntity.ok("Doctor deleted successfully");
        }).orElse(ResponseEntity.notFound().build());
    }
}
