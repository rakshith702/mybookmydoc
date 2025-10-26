package com.example.mybookmydoctor_backend.repository;

import com.example.mybookmydoctor_backend.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByDoctorId(Long doctorId);
    List<Feedback> findByPatientId(Long patientId);
}
