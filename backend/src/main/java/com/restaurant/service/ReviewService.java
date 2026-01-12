package com.restaurant.service;

import com.restaurant.dto.ReviewRequest;
import com.restaurant.entity.MenuItem;
import com.restaurant.entity.Review;
import com.restaurant.entity.User;
import com.restaurant.repository.MenuItemRepository;
import com.restaurant.repository.ReviewRepository;
import com.restaurant.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Transactional
    public Review createReview(String userEmail, ReviewRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        MenuItem menuItem = menuItemRepository.findById(request.getMenuItemId())
                .orElseThrow(() -> new RuntimeException("Menu item not found"));

        // Check if user already reviewed this item
        reviewRepository.findByUserAndMenuItem(user, menuItem)
                .ifPresent(existingReview -> {
                    throw new RuntimeException("You have already reviewed this item");
                });

        Review review = new Review();
        review.setUser(user);
        review.setMenuItem(menuItem);
        review.setRating(request.getRating());
        review.setComment(request.getComment());

        Review savedReview = reviewRepository.save(review);

        // Update menu item average rating
        menuItem.updateRating();
        menuItemRepository.save(menuItem);

        return savedReview;
    }

    public List<Review> getMenuItemReviews(Long menuItemId) {
        MenuItem menuItem = menuItemRepository.findById(menuItemId)
                .orElseThrow(() -> new RuntimeException("Menu item not found"));
        return reviewRepository.findByMenuItemOrderByCreatedAtDesc(menuItem);
    }

    public List<Review> getUserReviews(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return reviewRepository.findByUserOrderByCreatedAtDesc(user);
    }

    @Transactional
    public void deleteReview(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        
        MenuItem menuItem = review.getMenuItem();
        reviewRepository.delete(review);
        
        // Update menu item rating
        menuItem.updateRating();
        menuItemRepository.save(menuItem);
    }
}
