package com.rentease.service;

import com.rentease.model.Booking;
import com.rentease.repository.BookingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
@Transactional
public class BookingService {

    private final BookingRepository bookingRepository;

    public BookingService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    public Booking createBooking(Booking booking) {
        if (booking.getBookingCode() == null || booking.getBookingCode().trim().isEmpty()) {
            int randomSuffix = 1000 + new Random().nextInt(9000);
            booking.setBookingCode("RE-2026-B" + randomSuffix);
        }
        if (booking.getBookingStatus() == null) {
            booking.setBookingStatus("CONFIRMED");
        }
        if (booking.getCreatedAt() == null) {
            booking.setCreatedAt(LocalDateTime.now());
        }
        return bookingRepository.save(booking);
    }

    public Optional<Booking> getBookingByCode(String bookingCode) {
        return bookingRepository.findByBookingCode(bookingCode);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Booking> getBookingsByProperty(Long propertyId) {
        return bookingRepository.findByPropertyId(propertyId);
    }

    public List<Booking> getBookingsByTenantEmail(String email) {
        return bookingRepository.findByTenantEmail(email);
    }

    public Booking updateBookingStatus(Long id, String status) {
        return bookingRepository.findById(id).map(booking -> {
            booking.setBookingStatus(status);
            return bookingRepository.save(booking);
        }).orElseThrow(() -> new RuntimeException("Booking not found with id " + id));
    }
}
