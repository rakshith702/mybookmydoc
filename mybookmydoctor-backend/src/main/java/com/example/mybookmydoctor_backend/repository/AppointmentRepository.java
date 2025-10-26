package com.example.mybookmydoctor_backend.repository;

import com.example.mybookmydoctor_backend.model.Appointment;
import com.example.mybookmydoctor_backend.model.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatientId(Long patientId);
    List<Appointment> findByDoctorId(Long doctorId);
    List<Appointment> findByStatus(AppointmentStatus status);
}
