package com.example.mybookmydoctor_backend.controller;

import com.example.mybookmydoctor_backend.model.Appointment;
import com.example.mybookmydoctor_backend.model.AppointmentStatus;
import com.example.mybookmydoctor_backend.repository.AppointmentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/appointments")
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AdminAppointmentController {

    private final AppointmentRepository appointmentRepo;

    public AdminAppointmentController(AppointmentRepository appointmentRepo) {
        this.appointmentRepo = appointmentRepo;
    }

    @GetMapping
    public List<Appointment> getAllAppointments() {
        return appointmentRepo.findAll();
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveAppointment(@PathVariable Long id) {
        return appointmentRepo.findById(id).map(app -> {
            app.setStatus(AppointmentStatus.APPROVED);
            return ResponseEntity.ok(appointmentRepo.save(app));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectAppointment(@PathVariable Long id) {
        return appointmentRepo.findById(id).map(app -> {
            app.setStatus(AppointmentStatus.REJECTED);
            return ResponseEntity.ok(appointmentRepo.save(app));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAppointment(@PathVariable Long id) {
        return appointmentRepo.findById(id).map(app -> {
            appointmentRepo.deleteById(id);
            return ResponseEntity.ok("Appointment deleted successfully");
        }).orElse(ResponseEntity.notFound().build());
    }
}
