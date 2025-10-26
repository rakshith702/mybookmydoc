package com.example.mybookmydoctor_backend.repository;



import com.example.mybookmydoctor_backend.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PatientRepository extends JpaRepository<Patient, Long> {
    Patient findByUserId(Long userId);
}
