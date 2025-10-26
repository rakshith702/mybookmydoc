package com.example.mybookmydoctor_backend.controller;

import com.example.mybookmydoctor_backend.model.Doctor;
import com.example.mybookmydoctor_backend.model.Role;
import com.example.mybookmydoctor_backend.model.User;
import com.example.mybookmydoctor_backend.repository.DoctorRepository;
import com.example.mybookmydoctor_backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class DoctorController {

    private final DoctorRepository doctorRepo;
    private final UserRepository userRepo;

    public DoctorController(DoctorRepository doctorRepo, UserRepository userRepo) {
        this.doctorRepo = doctorRepo;
        this.userRepo = userRepo;
    }

    @GetMapping
    public ResponseEntity<List<Doctor>> getAllDoctors() {
        return ResponseEntity.ok(doctorRepo.findAll());
    }

    @PostMapping
    public ResponseEntity<Doctor> addDoctor(@RequestBody Doctor doctor) {
        if (doctor.getUser() != null) {
            User user = doctor.getUser();
            user.setRole(Role.ROLE_DOCTOR);
            userRepo.save(user);
        }
        Doctor saved = doctorRepo.save(doctor);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Doctor> updateDoctor(@PathVariable Long id, @RequestBody Doctor doctor) {
        Doctor existing = doctorRepo.findById(id).orElse(null);
        if (existing == null) return ResponseEntity.notFound().build();

        existing.setSpecialization(doctor.getSpecialization());
        if (existing.getUser() != null && doctor.getUser() != null) {
            existing.getUser().setFullName(doctor.getUser().getFullName());
            userRepo.save(existing.getUser());
        }

        doctorRepo.save(existing);
        return ResponseEntity.ok(existing);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDoctor(@PathVariable Long id) {
        if (!doctorRepo.existsById(id)) return ResponseEntity.notFound().build();
        doctorRepo.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
