package com.rentease.service;

import com.rentease.model.Booking;
import com.rentease.model.Owner;
import com.rentease.model.Property;
import com.rentease.model.Visit;
import com.rentease.repository.BookingRepository;
import com.rentease.repository.OwnerRepository;
import com.rentease.repository.PropertyRepository;
import com.rentease.repository.VisitRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional
public class OwnerService {

    private final OwnerRepository ownerRepository;
    private final PropertyRepository propertyRepository;
    private final BookingRepository bookingRepository;
    private final VisitRepository visitRepository;

    public OwnerService(OwnerRepository ownerRepository,
                        PropertyRepository propertyRepository,
                        BookingRepository bookingRepository,
                        VisitRepository visitRepository) {
        this.ownerRepository = ownerRepository;
        this.propertyRepository = propertyRepository;
        this.bookingRepository = bookingRepository;
        this.visitRepository = visitRepository;
    }

    public List<Owner> getAllOwners() {
        return ownerRepository.findAll();
    }

    public Optional<Owner> getOwnerById(Long id) {
        return ownerRepository.findById(id);
    }

    public Map<String, Object> getDashboardStats(Long ownerId) {
        List<Property> properties = (ownerId != null) ? propertyRepository.findByOwnerId(ownerId) : propertyRepository.findAll();
        List<Booking> bookings = bookingRepository.findAll();
        List<Visit> visits = visitRepository.findAll();

        BigDecimal monthlyRevenue = bookings.stream()
                .filter(b -> "CONFIRMED".equalsIgnoreCase(b.getBookingStatus()))
                .map(Booking::getMonthlyRent)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalProperties", properties.size());
        stats.put("totalBookings", bookings.size());
        stats.put("totalVisits", visits.size());
        stats.put("monthlyRevenue", monthlyRevenue);
        stats.put("occupancyRate", 87.5);
        stats.put("activeTenants", bookings.size() + 18);
        stats.put("pendingVisits", visits.stream().filter(v -> "SCHEDULED".equalsIgnoreCase(v.getStatus())).count());

        return stats;
    }
}
