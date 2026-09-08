package com.rentease.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "properties")
public class Property {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String pgType; // BOYS, GIRLS, UNISEX, CO_LIVING

    @Column(nullable = false)
    private String city; // Bangalore, Pune, Delhi NCR, Mumbai, Hyderabad

    @Column(nullable = false)
    private String locality; // Koramangala, HSR Layout, Hinjewadi, Cyber City, etc.

    @Column(columnDefinition = "TEXT")
    private String address;

    private Double latitude;
    private Double longitude;

    private BigDecimal startingPrice; // e.g. 8500.00
    private BigDecimal depositAmount; // e.g. 15000.00
    private Integer noticePeriodDays = 30;

    private Boolean verified = true;
    private Double rating = 4.8;
    private Integer reviewCount = 0;

    private Boolean foodIncluded = true;
    private String foodType = "VEG_NONVEG"; // VEG, NON_VEG, VEG_NONVEG
    private String gateClosingTime = "11:00 PM"; // e.g. "No Curfew", "10:30 PM", "11:00 PM"
    private Boolean visitorsAllowed = true;
    private Boolean nonVegAllowed = true;

    private String nearbyLandmark;
    private String distanceToLandmark; // e.g. "400m to Metro", "800m to Tech Park"

    @ElementCollection
    @CollectionTable(name = "property_images", joinColumns = @JoinColumn(name = "property_id"))
    @Column(name = "image_url", columnDefinition = "TEXT")
    private List<String> images = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "property_amenities", joinColumns = @JoinColumn(name = "property_id"))
    @Column(name = "amenity")
    private List<String> amenities = new ArrayList<>();

    @OneToMany(mappedBy = "property", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<RoomType> roomTypes = new ArrayList<>();

    @OneToMany(mappedBy = "property", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Review> reviews = new ArrayList<>();

    private Long ownerId;
    private String ownerName;
    private String ownerPhone;
    private String status = "ACTIVE"; // ACTIVE, INACTIVE, FULL

    private LocalDateTime createdAt = LocalDateTime.now();

    public Property() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getPgType() { return pgType; }
    public void setPgType(String pgType) { this.pgType = pgType; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getLocality() { return locality; }
    public void setLocality(String locality) { this.locality = locality; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public BigDecimal getStartingPrice() { return startingPrice; }
    public void setStartingPrice(BigDecimal startingPrice) { this.startingPrice = startingPrice; }

    public BigDecimal getDepositAmount() { return depositAmount; }
    public void setDepositAmount(BigDecimal depositAmount) { this.depositAmount = depositAmount; }

    public Integer getNoticePeriodDays() { return noticePeriodDays; }
    public void setNoticePeriodDays(Integer noticePeriodDays) { this.noticePeriodDays = noticePeriodDays; }

    public Boolean getVerified() { return verified; }
    public void setVerified(Boolean verified) { this.verified = verified; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public Integer getReviewCount() { return reviewCount; }
    public void setReviewCount(Integer reviewCount) { this.reviewCount = reviewCount; }

    public Boolean getFoodIncluded() { return foodIncluded; }
    public void setFoodIncluded(Boolean foodIncluded) { this.foodIncluded = foodIncluded; }

    public String getFoodType() { return foodType; }
    public void setFoodType(String foodType) { this.foodType = foodType; }

    public String getGateClosingTime() { return gateClosingTime; }
    public void setGateClosingTime(String gateClosingTime) { this.gateClosingTime = gateClosingTime; }

    public Boolean getVisitorsAllowed() { return visitorsAllowed; }
    public void setVisitorsAllowed(Boolean visitorsAllowed) { this.visitorsAllowed = visitorsAllowed; }

    public Boolean getNonVegAllowed() { return nonVegAllowed; }
    public void setNonVegAllowed(Boolean nonVegAllowed) { this.nonVegAllowed = nonVegAllowed; }

    public String getNearbyLandmark() { return nearbyLandmark; }
    public void setNearbyLandmark(String nearbyLandmark) { this.nearbyLandmark = nearbyLandmark; }

    public String getDistanceToLandmark() { return distanceToLandmark; }
    public void setDistanceToLandmark(String distanceToLandmark) { this.distanceToLandmark = distanceToLandmark; }

    public List<String> getImages() { return images; }
    public void setImages(List<String> images) { this.images = images; }

    public List<String> getAmenities() { return amenities; }
    public void setAmenities(List<String> amenities) { this.amenities = amenities; }

    public List<RoomType> getRoomTypes() { return roomTypes; }
    public void setRoomTypes(List<RoomType> roomTypes) { this.roomTypes = roomTypes; }

    public List<Review> getReviews() { return reviews; }
    public void setReviews(List<Review> reviews) { this.reviews = reviews; }

    public Long getOwnerId() { return ownerId; }
    public void setOwnerId(Long ownerId) { this.ownerId = ownerId; }

    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }

    public String getOwnerPhone() { return ownerPhone; }
    public void setOwnerPhone(String ownerPhone) { this.ownerPhone = ownerPhone; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
