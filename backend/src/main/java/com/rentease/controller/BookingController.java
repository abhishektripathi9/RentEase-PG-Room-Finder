package com.rentease.controller;

import com.rentease.model.Booking;
import com.rentease.service.BookingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<Booking> createBooking(@RequestBody Booking booking) {
        Booking created = bookingService.createBooking(booking);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<Booking> getBookingByCode(@PathVariable String code) {
        return bookingService.getBookingByCode(code)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/property/{propertyId}")
    public ResponseEntity<List<Booking>> getBookingsByProperty(@PathVariable Long propertyId) {
        return ResponseEntity.ok(bookingService.getBookingsByProperty(propertyId));
    }

    @GetMapping("/tenant")
    public ResponseEntity<List<Booking>> getBookingsByTenantEmail(@RequestParam String email) {
        return ResponseEntity.ok(bookingService.getBookingsByTenantEmail(email));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Booking> updateBookingStatus(@PathVariable Long id, @RequestBody Map<String, String> statusBody) {
        String status = statusBody.get("status");
        try {
            Booking updated = bookingService.updateBookingStatus(id, status);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
