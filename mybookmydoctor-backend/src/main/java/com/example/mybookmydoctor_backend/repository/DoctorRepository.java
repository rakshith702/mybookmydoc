package com.example.mybookmydoctor_backend.repository;



import com.example.mybookmydoctor_backend.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DoctorRepository extends JpaRepository<Doctor, Long> { }
