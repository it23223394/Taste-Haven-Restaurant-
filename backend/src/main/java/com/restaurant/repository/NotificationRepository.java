package com.restaurant.repository;

import com.restaurant.entity.Notification;
import com.restaurant.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserOrderByCreatedAtDesc(User user);
    List<Notification> findByUserAndReadOrderByCreatedAtDesc(User user, Boolean read);
    Long countByUserAndRead(User user, Boolean read);
}
