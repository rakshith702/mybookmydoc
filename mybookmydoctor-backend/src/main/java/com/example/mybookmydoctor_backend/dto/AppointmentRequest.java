package com.example.mybookmydoctor_backend.dto;

public class AppointmentRequest {

    private Long doctorId;
    private String appointmentDateTime;
    private String reason;

    public AppointmentRequest() {}

    public AppointmentRequest(Long doctorId, String appointmentDateTime, String reason) {
        this.doctorId = doctorId;
        this.appointmentDateTime = appointmentDateTime;
        this.reason = reason;
    }

    public Long getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(Long doctorId) {
        this.doctorId = doctorId;
    }

    public String getAppointmentDateTime() {
        return appointmentDateTime;
    }

    public void setAppointmentDateTime(String appointmentDateTime) {
        this.appointmentDateTime = appointmentDateTime;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
