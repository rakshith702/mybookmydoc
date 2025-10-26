package com.example.mybookmydoctor_backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Feedback {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(cascade = CascadeType.REMOVE)
    @JsonIgnoreProperties({"appointments", "feedbacks", "patients"})
    private Doctor doctor;

    @ManyToOne
    @JsonIgnoreProperties({"appointments", "feedbacks"})
    private Patient patient;

    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;
}
