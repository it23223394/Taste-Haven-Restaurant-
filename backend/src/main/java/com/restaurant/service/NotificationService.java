package com.restaurant.service;

import com.restaurant.entity.Notification;
import com.restaurant.entity.User;
import com.restaurant.repository.NotificationRepository;
import com.restaurant.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public Notification createNotification(User user, String title, String message, Notification.NotificationType type) {
        // Check user preferences
        boolean shouldSend = switch (type) {
            case ORDER_UPDATE -> user.getNotifyOrders();
            case RESERVATION_CONFIRMATION, RESERVATION_REMINDER -> user.getNotifyReservations();
            case PROMOTION -> user.getNotifyPromotions();
            default -> true;
        };

        if (!shouldSend) {
            return null;
        }

        Notification notification = new Notification();
        notification.setUser(user);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type);
        notification.setRead(false);

        return notificationRepository.save(notification);
    }

    public List<Notification> getUserNotifications(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return notificationRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public List<Notification> getUnreadNotifications(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return notificationRepository.findByUserAndReadOrderByCreatedAtDesc(user, false);
    }

    public Long getUnreadCount(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return notificationRepository.countByUserAndRead(user, false);
    }

    @Transactional
    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    @Transactional
    public void markAllAsRead(String userEmail) {
        List<Notification> notifications = getUnreadNotifications(userEmail);
        notifications.forEach(notification -> notification.setRead(true));
        notificationRepository.saveAll(notifications);
    }
}
