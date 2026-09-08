package com.rentease.service;

import com.rentease.model.Visit;
import com.rentease.repository.VisitRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
@Transactional
public class VisitService {

    private final VisitRepository visitRepository;

    public VisitService(VisitRepository visitRepository) {
        this.visitRepository = visitRepository;
    }

    public Visit scheduleVisit(Visit visit) {
        if (visit.getVisitCode() == null || visit.getVisitCode().trim().isEmpty()) {
            int randomSuffix = 1000 + new Random().nextInt(9000);
            visit.setVisitCode("VST-" + randomSuffix);
        }
        if (visit.getStatus() == null) {
            visit.setStatus("SCHEDULED");
        }
        if (visit.getCreatedAt() == null) {
            visit.setCreatedAt(LocalDateTime.now());
        }
        return visitRepository.save(visit);
    }

    public Optional<Visit> getVisitByCode(String visitCode) {
        return visitRepository.findByVisitCode(visitCode);
    }

    public List<Visit> getAllVisits() {
        return visitRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Visit> getVisitsByProperty(Long propertyId) {
        return visitRepository.findByPropertyId(propertyId);
    }

    public Visit updateVisitStatus(Long id, String status) {
        return visitRepository.findById(id).map(visit -> {
            visit.setStatus(status);
            return visitRepository.save(visit);
        }).orElseThrow(() -> new RuntimeException("Visit not found with id " + id));
    }
}
