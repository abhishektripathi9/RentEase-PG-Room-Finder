package com.rentease.controller;

import com.rentease.model.Property;
import com.rentease.service.PropertyService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/properties")
@CrossOrigin(origins = "*")
public class PropertyController {

    private final PropertyService propertyService;

    public PropertyController(PropertyService propertyService) {
        this.propertyService = propertyService;
    }

    @GetMapping
    public ResponseEntity<List<Property>> getProperties(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String pgType,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Boolean verified,
            @RequestParam(required = false) String query
    ) {
        if (city == null && pgType == null && maxPrice == null && verified == null && query == null) {
            return ResponseEntity.ok(propertyService.getAllProperties());
        }
        return ResponseEntity.ok(propertyService.searchProperties(city, pgType, maxPrice, verified, query));
    }

    @GetMapping("/featured")
    public ResponseEntity<List<Property>> getFeaturedProperties() {
        return ResponseEntity.ok(propertyService.getFeaturedProperties());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Property> getPropertyById(@PathVariable Long id) {
        return propertyService.getPropertyById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Property> createProperty(@RequestBody Property property) {
        Property saved = propertyService.saveProperty(property);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Property> updateProperty(@PathVariable Long id, @RequestBody Property property) {
        try {
            Property updated = propertyService.updateProperty(id, property);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProperty(@PathVariable Long id) {
        propertyService.deleteProperty(id);
        return ResponseEntity.noContent().build();
    }
}
