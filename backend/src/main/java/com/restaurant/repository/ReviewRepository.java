package com.restaurant.repository;

import com.restaurant.entity.Review;
import com.restaurant.entity.MenuItem;
import com.restaurant.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByMenuItemOrderByCreatedAtDesc(MenuItem menuItem);
    List<Review> findByUserOrderByCreatedAtDesc(User user);
    Optional<Review> findByUserAndMenuItem(User user, MenuItem menuItem);
}
