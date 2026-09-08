package com.rentease.controller;

import com.rentease.model.Review;
import com.rentease.service.ReviewService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/properties/{propertyId}/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping
    public ResponseEntity<List<Review>> getReviews(@PathVariable Long propertyId) {
        return ResponseEntity.ok(reviewService.getReviewsForProperty(propertyId));
    }

    @PostMapping
    public ResponseEntity<Review> addReview(@PathVariable Long propertyId, @RequestBody Review review) {
        Review saved = reviewService.addReview(propertyId, review);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}
