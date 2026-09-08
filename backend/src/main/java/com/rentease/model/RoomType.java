package com.rentease.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "room_types")
public class RoomType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id", nullable = false)
    @JsonIgnore
    private Property property;

    @Column(nullable = false)
    private String roomCategory; // SINGLE, DOUBLE, TRIPLE, FOUR_PLUS

    private String title; // "Private Single Occupancy Room", "Twin Sharing Executive Room"

    @Column(nullable = false)
    private BigDecimal pricePerMonth;

    private BigDecimal depositAmount;
    private Integer totalBeds = 2;
    private Integer availableBeds = 1;

    private Boolean hasAttachedWashroom = true;
    private Boolean hasAc = true;
    private Boolean hasBalcony = false;

    public RoomType() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Property getProperty() { return property; }
    public void setProperty(Property property) { this.property = property; }

    public String getRoomCategory() { return roomCategory; }
    public void setRoomCategory(String roomCategory) { this.roomCategory = roomCategory; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public BigDecimal getPricePerMonth() { return pricePerMonth; }
    public void setPricePerMonth(BigDecimal pricePerMonth) { this.pricePerMonth = pricePerMonth; }

    public BigDecimal getDepositAmount() { return depositAmount; }
    public void setDepositAmount(BigDecimal depositAmount) { this.depositAmount = depositAmount; }

    public Integer getTotalBeds() { return totalBeds; }
    public void setTotalBeds(Integer totalBeds) { this.totalBeds = totalBeds; }

    public Integer getAvailableBeds() { return availableBeds; }
    public void setAvailableBeds(Integer availableBeds) { this.availableBeds = availableBeds; }

    public Boolean getHasAttachedWashroom() { return hasAttachedWashroom; }
    public void setHasAttachedWashroom(Boolean hasAttachedWashroom) { this.hasAttachedWashroom = hasAttachedWashroom; }

    public Boolean getHasAc() { return hasAc; }
    public void setHasAc(Boolean hasAc) { this.hasAc = hasAc; }

    public Boolean getHasBalcony() { return hasBalcony; }
    public void setHasBalcony(Boolean hasBalcony) { this.hasBalcony = hasBalcony; }
}
