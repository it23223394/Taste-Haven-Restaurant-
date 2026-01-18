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

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
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

    @Transactional
    public User createUser(User user) {
        // Check if email already exists
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }
        
        // Encode password
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        // Set default role if not specified
        if (user.getRole() == null) {
            user.setRole(User.Role.CUSTOMER);
        }
        
        // Set default notification preferences
        if (user.getNotifyOrders() == null) user.setNotifyOrders(true);
        if (user.getNotifyReservations() == null) user.setNotifyReservations(true);
        if (user.getNotifyPromotions() == null) user.setNotifyPromotions(false);
        
        return userRepository.save(user);
    }

    @Transactional
    public User updateUserRole(Long userId, String role) {
        User user = getUserById(userId);
        user.setRole(User.Role.valueOf(role));
        return userRepository.save(user);
    }

    @Transactional
    public void deleteUser(Long userId) {
        User user = getUserById(userId);
        userRepository.delete(user);
    }
}
