package com.rentease.controller;

import com.rentease.model.Owner;
import com.rentease.model.Property;
import com.rentease.service.OwnerService;
import com.rentease.service.PropertyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/owners")
@CrossOrigin(origins = "*")
public class OwnerController {

    private final OwnerService ownerService;
    private final PropertyService propertyService;

    public OwnerController(OwnerService ownerService, PropertyService propertyService) {
        this.ownerService = ownerService;
        this.propertyService = propertyService;
    }

    @GetMapping
    public ResponseEntity<List<Owner>> getAllOwners() {
        return ResponseEntity.ok(ownerService.getAllOwners());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Owner> getOwnerById(@PathVariable Long id) {
        return ownerService.getOwnerById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/stats")
    public ResponseEntity<Map<String, Object>> getOwnerStats(@PathVariable Long id) {
        return ResponseEntity.ok(ownerService.getDashboardStats(id));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getGeneralStats() {
        return ResponseEntity.ok(ownerService.getDashboardStats(null));
    }

    @GetMapping("/{id}/properties")
    public ResponseEntity<List<Property>> getOwnerProperties(@PathVariable Long id) {
        return ResponseEntity.ok(propertyService.getPropertiesByOwner(id));
    }
}
