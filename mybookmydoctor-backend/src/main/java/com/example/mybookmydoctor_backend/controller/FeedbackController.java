package com.example.mybookmydoctor_backend.controller;

import com.example.mybookmydoctor_backend.model.*;
import com.example.mybookmydoctor_backend.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/feedbacks")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class FeedbackController {

    private final FeedbackRepository feedbackRepo;
    private final DoctorRepository doctorRepo;
    private final PatientRepository patientRepo;
    private final UserRepository userRepo;

    public FeedbackController(FeedbackRepository feedbackRepo, DoctorRepository doctorRepo, PatientRepository patientRepo, UserRepository userRepo) {
        this.feedbackRepo = feedbackRepo;
        this.doctorRepo = doctorRepo;
        this.patientRepo = patientRepo;
        this.userRepo = userRepo;
    }

    @PostMapping
    public ResponseEntity<?> giveFeedback(
            @RequestParam Long doctorId,
            @RequestParam Integer rating,
            @RequestParam String comment,
            Authentication auth) {

        String username = auth.getName();
        User user = userRepo.findByUsername(username).orElse(null);
        if (user == null) return ResponseEntity.status(401).body("unauthenticated");

        Patient patient = patientRepo.findByUserId(user.getId());
        if (patient == null) return ResponseEntity.status(403).body("only patients can give feedback");

        Doctor doctor = doctorRepo.findById(doctorId).orElse(null);
        if (doctor == null) return ResponseEntity.badRequest().body("doctor not found");

        Feedback feedback = new Feedback();
        feedback.setDoctor(doctor);
        feedback.setPatient(patient);
        feedback.setRating(rating);
        feedback.setComment(comment);
        feedback.setCreatedAt(LocalDateTime.now());
        feedbackRepo.save(feedback);

        return ResponseEntity.ok(feedback);
    }

    @GetMapping("/forMe")
    public ResponseEntity<?> feedbackForDoctor(Authentication auth) {
        String username = auth.getName();
        User user = userRepo.findByUsername(username).orElse(null);
        if (user == null) return ResponseEntity.status(401).body("unauthenticated");

        Doctor doctor = doctorRepo.findAll().stream()
                .filter(d -> d.getUser().getId().equals(user.getId()))
                .findFirst().orElse(null);

        if (doctor == null) return ResponseEntity.status(404).body("doctor profile missing");

        List<Feedback> feedbacks = feedbackRepo.findByDoctorId(doctor.getId());
        return ResponseEntity.ok(feedbacks);
    }

    @GetMapping("/mine")
    public ResponseEntity<?> myFeedbacks(Authentication auth) {
        String username = auth.getName();
        User user = userRepo.findByUsername(username).orElse(null);
        if (user == null) return ResponseEntity.status(401).body("unauthenticated");

        Patient patient = patientRepo.findByUserId(user.getId());
        if (patient == null) return ResponseEntity.status(403).body("only patients have feedback history");

        return ResponseEntity.ok(feedbackRepo.findByPatientId(patient.getId()));
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<?> getFeedbackByDoctor(@PathVariable Long doctorId) {
        List<Feedback> feedbackList = feedbackRepo.findByDoctorId(doctorId);
        return ResponseEntity.ok(feedbackList);
    }
}
