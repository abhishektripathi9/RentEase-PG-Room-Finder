package com.rentease.repository;

import com.rentease.model.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {

    List<Property> findByCityIgnoreCase(String city);

    List<Property> findByOwnerId(Long ownerId);

    List<Property> findByVerifiedTrue();

    @Query("SELECT p FROM Property p WHERE " +
           "(:city IS NULL OR LOWER(p.city) = LOWER(:city)) AND " +
           "(:pgType IS NULL OR p.pgType = :pgType) AND " +
           "(:maxPrice IS NULL OR p.startingPrice <= :maxPrice) AND " +
           "(:verified IS NULL OR p.verified = :verified) AND " +
           "(:query IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.locality) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Property> searchProperties(
            @Param("city") String city,
            @Param("pgType") String pgType,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("verified") Boolean verified,
            @Param("query") String query
    );
}
