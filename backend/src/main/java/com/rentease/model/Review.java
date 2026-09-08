package com.rentease.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id", nullable = false)
    @JsonIgnore
    private Property property;

    @Column(nullable = false)
    private String authorName;

    private String authorRole; // "Software Dev at Amazon", "Student, Christ Univ"
    private Double rating = 5.0;

    @Column(columnDefinition = "TEXT")
    private String comment;

    private Double cleanlinessRating = 4.8;
    private Double foodRating = 4.5;
    private Double wifiRating = 4.9;
    private Double securityRating = 4.9;
    private Double valueRating = 4.7;

    private LocalDateTime createdAt = LocalDateTime.now();

    public Review() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Property getProperty() { return property; }
    public void setProperty(Property property) { this.property = property; }

    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }

    public String getAuthorRole() { return authorRole; }
    public void setAuthorRole(String authorRole) { this.authorRole = authorRole; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public Double getCleanlinessRating() { return cleanlinessRating; }
    public void setCleanlinessRating(Double cleanlinessRating) { this.cleanlinessRating = cleanlinessRating; }

    public Double getFoodRating() { return foodRating; }
    public void setFoodRating(Double foodRating) { this.foodRating = foodRating; }

    public Double getWifiRating() { return wifiRating; }
    public void setWifiRating(Double wifiRating) { this.wifiRating = wifiRating; }

    public Double getSecurityRating() { return securityRating; }
    public void setSecurityRating(Double securityRating) { this.securityRating = securityRating; }

    public Double getValueRating() { return valueRating; }
    public void setValueRating(Double valueRating) { this.valueRating = valueRating; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
