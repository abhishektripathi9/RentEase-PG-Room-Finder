package com.rentease.repository;

import com.rentease.model.Visit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VisitRepository extends JpaRepository<Visit, Long> {
    Optional<Visit> findByVisitCode(String visitCode);
    List<Visit> findByPropertyId(Long propertyId);
    List<Visit> findByVisitorEmail(String visitorEmail);
    List<Visit> findAllByOrderByCreatedAtDesc();
}
