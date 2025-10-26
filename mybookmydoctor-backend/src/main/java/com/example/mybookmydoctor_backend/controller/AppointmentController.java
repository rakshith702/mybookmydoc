package com.example.mybookmydoctor_backend.controller;

import com.example.mybookmydoctor_backend.dto.AppointmentRequest;
import com.example.mybookmydoctor_backend.model.*;
import com.example.mybookmydoctor_backend.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AppointmentController {

    private final AppointmentRepository appointmentRepo;
    private final UserRepository userRepo;
    private final PatientRepository patientRepo;
    private final DoctorRepository doctorRepo;

    public AppointmentController(AppointmentRepository appointmentRepo,
                                 UserRepository userRepo,
                                 PatientRepository patientRepo,
                                 DoctorRepository doctorRepo) {
        this.appointmentRepo = appointmentRepo;
        this.userRepo = userRepo;
        this.patientRepo = patientRepo;
        this.doctorRepo = doctorRepo;
    }

    @PostMapping
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<?> book(@RequestBody AppointmentRequest req, Authentication auth) {
        String username = auth.getName();
        User user = userRepo.findByUsername(username).orElse(null);
        if (user == null) return ResponseEntity.status(401).body("Unauthenticated");

        Patient patient = patientRepo.findByUserId(user.getId());
        if (patient == null) return ResponseEntity.badRequest().body("Patient profile missing");

        Doctor doctor = doctorRepo.findById(req.getDoctorId()).orElse(null);
        if (doctor == null) return ResponseEntity.badRequest().body("Doctor not found");

        LocalDateTime dt;
        try {
            dt = LocalDateTime.parse(req.getAppointmentDateTime());
        } catch (DateTimeParseException ex) {
            return ResponseEntity.badRequest().body("Invalid date format, use ISO datetime e.g. 2025-10-05T14:30");
        }

        Appointment ap = new Appointment();
        ap.setDoctor(doctor);
        ap.setPatient(patient);
        ap.setAppointmentDateTime(dt);
        ap.setReason(req.getReason());
        ap.setStatus(AppointmentStatus.PENDING);
        ap.setCreatedAt(LocalDateTime.now());
        appointmentRepo.save(ap);

        return ResponseEntity.ok(ap);
    }

    @GetMapping
    public ResponseEntity<?> myAppointments(Authentication auth) {
        String username = auth.getName();
        User user = userRepo.findByUsername(username).orElse(null);
        if (user == null) return ResponseEntity.status(401).body("Unauthenticated");

        if (user.getRole() == Role.ROLE_PATIENT) {
            Patient p = patientRepo.findByUserId(user.getId());
            return ResponseEntity.ok(appointmentRepo.findByPatientId(p.getId()));
        } else if (user.getRole() == Role.ROLE_DOCTOR) {
            Doctor d = doctorRepo.findAll().stream()
                    .filter(doc -> doc.getUser().getId().equals(user.getId()))
                    .findFirst().orElse(null);
            if (d == null) return ResponseEntity.ok(List.of());
            return ResponseEntity.ok(appointmentRepo.findByDoctorId(d.getId()));
        } else if (user.getRole() == Role.ROLE_ADMIN) {
            return ResponseEntity.ok(appointmentRepo.findAll());
        } else {
            return ResponseEntity.status(403).body("Forbidden");
        }
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Appointment> getPendingAppointments() {
        return appointmentRepo.findByStatus(AppointmentStatus.PENDING);
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<?> approve(@PathVariable Long id) {
        Appointment a = appointmentRepo.findById(id).orElse(null);
        if (a == null) return ResponseEntity.notFound().build();
        a.setStatus(AppointmentStatus.APPROVED);
        appointmentRepo.save(a);
        return ResponseEntity.ok(a);
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<?> reject(@PathVariable Long id) {
        Appointment a = appointmentRepo.findById(id).orElse(null);
        if (a == null) return ResponseEntity.notFound().build();
        a.setStatus(AppointmentStatus.REJECTED);
        appointmentRepo.save(a);
        return ResponseEntity.ok(a);
    }

    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'PATIENT')")
    public ResponseEntity<?> cancel(@PathVariable Long id) {
        Appointment a = appointmentRepo.findById(id).orElse(null);
        if (a == null) return ResponseEntity.notFound().build();
        a.setStatus(AppointmentStatus.CANCELLED);
        appointmentRepo.save(a);
        return ResponseEntity.ok(a);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteAppointment(@PathVariable Long id) {
        Appointment a = appointmentRepo.findById(id).orElse(null);
        if (a == null) return ResponseEntity.notFound().build();
        appointmentRepo.deleteById(id);
        return ResponseEntity.ok("Appointment deleted successfully");
    }
}
