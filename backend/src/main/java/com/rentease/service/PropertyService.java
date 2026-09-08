package com.rentease.service;

import com.rentease.model.Property;
import com.rentease.model.RoomType;
import com.rentease.repository.PropertyRepository;
import com.rentease.repository.RoomTypeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PropertyService {

    private final PropertyRepository propertyRepository;
    private final RoomTypeRepository roomTypeRepository;

    public PropertyService(PropertyRepository propertyRepository, RoomTypeRepository roomTypeRepository) {
        this.propertyRepository = propertyRepository;
        this.roomTypeRepository = roomTypeRepository;
    }

    public List<Property> getAllProperties() {
        return propertyRepository.findAll();
    }

    public List<Property> searchProperties(String city, String pgType, BigDecimal maxPrice, Boolean verified, String query) {
        return propertyRepository.searchProperties(city, pgType, maxPrice, verified, query);
    }

    public Optional<Property> getPropertyById(Long id) {
        return propertyRepository.findById(id);
    }

    public List<Property> getPropertiesByCity(String city) {
        return propertyRepository.findByCityIgnoreCase(city);
    }

    public List<Property> getFeaturedProperties() {
        return propertyRepository.findByVerifiedTrue();
    }

    public List<Property> getPropertiesByOwner(Long ownerId) {
        return propertyRepository.findByOwnerId(ownerId);
    }

    public Property saveProperty(Property property) {
        if (property.getRoomTypes() != null) {
            for (RoomType room : property.getRoomTypes()) {
                room.setProperty(property);
            }
        }
        return propertyRepository.save(property);
    }

    public Property updateProperty(Long id, Property updated) {
        return propertyRepository.findById(id).map(existing -> {
            existing.setName(updated.getName());
            existing.setDescription(updated.getDescription());
            existing.setPgType(updated.getPgType());
            existing.setCity(updated.getCity());
            existing.setLocality(updated.getLocality());
            existing.setAddress(updated.getAddress());
            existing.setLatitude(updated.getLatitude());
            existing.setLongitude(updated.getLongitude());
            existing.setStartingPrice(updated.getStartingPrice());
            existing.setDepositAmount(updated.getDepositAmount());
            existing.setNoticePeriodDays(updated.getNoticePeriodDays());
            existing.setFoodIncluded(updated.getFoodIncluded());
            existing.setFoodType(updated.getFoodType());
            existing.setGateClosingTime(updated.getGateClosingTime());
            existing.setVisitorsAllowed(updated.getVisitorsAllowed());
            existing.setNonVegAllowed(updated.getNonVegAllowed());
            existing.setAmenities(updated.getAmenities());
            existing.setStatus(updated.getStatus());
            return propertyRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Property not found with id " + id));
    }

    public void deleteProperty(Long id) {
        propertyRepository.deleteById(id);
    }
}
