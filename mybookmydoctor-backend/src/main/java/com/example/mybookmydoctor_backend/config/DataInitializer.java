package com.example.mybookmydoctor_backend.config;



import com.example.mybookmydoctor_backend.model.*;
import com.example.mybookmydoctor_backend.model.Role;
import com.example.mybookmydoctor_backend.repository.*;
import com.example.mybookmydoctor_backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner init(UserRepository userRepo, DoctorRepository doctorRepo, PatientRepository patientRepo, BCryptPasswordEncoder encoder) {
        return args -> {
            if (userRepo.findByUsername("admin").isEmpty()) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setPassword(encoder.encode("admin123"));
                admin.setFullName("Administrator");
                admin.setRole(Role.ROLE_ADMIN);
                admin.setEmail("admin@example.com");

                userRepo.save(admin);

            }

            if (userRepo.findByUsername("doc1").isEmpty()) {
                User u = new User();
                u.setUsername("doc1");
                u.setPassword(encoder.encode("doc123"));
                u.setFullName("Dr. One");
                u.setRole(Role.ROLE_DOCTOR);
                u.setEmail("doc1@example.com");

                u = userRepo.save(u);

                Doctor d = new Doctor();
                d.setUser(u);
                d.setSpecialization("Cardiology");
                d.setPhone("999999");

                doctorRepo.save(d);
            }

            if (userRepo.findByUsername("pat1").isEmpty()) {
                User u = new User();
                u.setUsername("pat1");
                u.setPassword(encoder.encode("pat123"));
                u.setFullName("Patient One");
                u.setRole(Role.ROLE_PATIENT);
                u.setEmail("pat1@example.com");

                u = userRepo.save(u);

                Patient p = new Patient();
                p.setUser(u);
                p.setPhone("888888");

                patientRepo.save(p);
            }

        };
    }
}
