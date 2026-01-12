package com.restaurant.service;

import com.restaurant.entity.User;
import com.restaurant.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public User updateUserProfile(String email, User updatedUser) {
        User user = getUserByEmail(email);
        
        user.setFirstName(updatedUser.getFirstName());
        user.setLastName(updatedUser.getLastName());
        user.setPhoneNumber(updatedUser.getPhoneNumber());
        
        return userRepository.save(user);
    }

    @Transactional
    public void updatePassword(String email, String currentPassword, String newPassword) {
        User user = getUserByEmail(email);
        
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }
        
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @Transactional
    public void updateNotificationPreferences(String email, Boolean notifyOrders, 
            Boolean notifyReservations, Boolean notifyPromotions) {
        User user = getUserByEmail(email);
        
        if (notifyOrders != null) user.setNotifyOrders(notifyOrders);
        if (notifyReservations != null) user.setNotifyReservations(notifyReservations);
        if (notifyPromotions != null) user.setNotifyPromotions(notifyPromotions);
        
        userRepository.save(user);
    }
}
