package com.rentease.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "visits")
public class Visit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String visitCode; // e.g. "VST-9382"

    @Column(nullable = false)
    private Long propertyId;
    private String propertyName;

    @Column(nullable = false)
    private String visitorName;

    @Column(nullable = false)
    private String visitorEmail;

    @Column(nullable = false)
    private String visitorPhone;

    @Column(nullable = false)
    private LocalDate visitDate;

    @Column(nullable = false)
    private String timeSlot; // "10:00 AM - 12:00 PM", "02:00 PM - 04:00 PM", "05:00 PM - 07:00 PM"

    private String visitType = "IN_PERSON"; // IN_PERSON, VIDEO_TOUR
    private String status = "SCHEDULED"; // SCHEDULED, COMPLETED, CANCELLED
    private String notes;

    private LocalDateTime createdAt = LocalDateTime.now();

    public Visit() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getVisitCode() { return visitCode; }
    public void setVisitCode(String visitCode) { this.visitCode = visitCode; }

    public Long getPropertyId() { return propertyId; }
    public void setPropertyId(Long propertyId) { this.propertyId = propertyId; }

    public String getPropertyName() { return propertyName; }
    public void setPropertyName(String propertyName) { this.propertyName = propertyName; }

    public String getVisitorName() { return visitorName; }
    public void setVisitorName(String visitorName) { this.visitorName = visitorName; }

    public String getVisitorEmail() { return visitorEmail; }
    public void setVisitorEmail(String visitorEmail) { this.visitorEmail = visitorEmail; }

    public String getVisitorPhone() { return visitorPhone; }
    public void setVisitorPhone(String visitorPhone) { this.visitorPhone = visitorPhone; }

    public LocalDate getVisitDate() { return visitDate; }
    public void setVisitDate(LocalDate visitDate) { this.visitDate = visitDate; }

    public String getTimeSlot() { return timeSlot; }
    public void setTimeSlot(String timeSlot) { this.timeSlot = timeSlot; }

    public String getVisitType() { return visitType; }
    public void setVisitType(String visitType) { this.visitType = visitType; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
