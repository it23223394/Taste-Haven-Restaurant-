package com.restaurant.controller;

import com.restaurant.dto.ReviewRequest;
import com.restaurant.entity.Review;
import com.restaurant.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping
    public ResponseEntity<Review> createReview(
            Authentication authentication,
            @Valid @RequestBody ReviewRequest request) {
        return ResponseEntity.ok(reviewService.createReview(authentication.getName(), request));
    }

    @GetMapping("/menu-item/{menuItemId}")
    public ResponseEntity<List<Review>> getMenuItemReviews(@PathVariable Long menuItemId) {
        return ResponseEntity.ok(reviewService.getMenuItemReviews(menuItemId));
    }

    @GetMapping("/user")
    public ResponseEntity<List<Review>> getUserReviews(Authentication authentication) {
        return ResponseEntity.ok(reviewService.getUserReviews(authentication.getName()));
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long reviewId) {
        reviewService.deleteReview(reviewId);
        return ResponseEntity.ok().build();
    }
}
