package com.rentease.service;

import com.rentease.model.Property;
import com.rentease.model.Review;
import com.rentease.repository.PropertyRepository;
import com.rentease.repository.ReviewRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final PropertyRepository propertyRepository;

    public ReviewService(ReviewRepository reviewRepository, PropertyRepository propertyRepository) {
        this.reviewRepository = reviewRepository;
        this.propertyRepository = propertyRepository;
    }

    public Review addReview(Long propertyId, Review review) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found with id " + propertyId));

        review.setProperty(property);
        if (review.getCreatedAt() == null) {
            review.setCreatedAt(LocalDateTime.now());
        }
        Review saved = reviewRepository.save(review);

        // Update property's average rating and count
        List<Review> allReviews = reviewRepository.findByPropertyIdOrderByCreatedAtDesc(propertyId);
        double avg = allReviews.stream().mapToDouble(Review::getRating).average().orElse(5.0);
        property.setRating(Math.round(avg * 10.0) / 10.0);
        property.setReviewCount(allReviews.size());
        propertyRepository.save(property);

        return saved;
    }

    public List<Review> getReviewsForProperty(Long propertyId) {
        return reviewRepository.findByPropertyIdOrderByCreatedAtDesc(propertyId);
    }
}
