package com.rentease.controller;

import com.rentease.model.Visit;
import com.rentease.service.VisitService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/visits")
@CrossOrigin(origins = "*")
public class VisitController {

    private final VisitService visitService;

    public VisitController(VisitService visitService) {
        this.visitService = visitService;
    }

    @PostMapping
    public ResponseEntity<Visit> scheduleVisit(@RequestBody Visit visit) {
        Visit scheduled = visitService.scheduleVisit(visit);
        return ResponseEntity.status(HttpStatus.CREATED).body(scheduled);
    }

    @GetMapping
    public ResponseEntity<List<Visit>> getAllVisits() {
        return ResponseEntity.ok(visitService.getAllVisits());
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<Visit> getVisitByCode(@PathVariable String code) {
        return visitService.getVisitByCode(code)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/property/{propertyId}")
    public ResponseEntity<List<Visit>> getVisitsByProperty(@PathVariable Long propertyId) {
        return ResponseEntity.ok(visitService.getVisitsByProperty(propertyId));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Visit> updateVisitStatus(@PathVariable Long id, @RequestBody Map<String, String> statusBody) {
        String status = statusBody.get("status");
        try {
            Visit updated = visitService.updateVisitStatus(id, status);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
