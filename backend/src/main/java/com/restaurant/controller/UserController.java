package com.restaurant.controller;

import com.restaurant.entity.User;
import com.restaurant.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<User> getUserProfile(Authentication authentication) {
        return ResponseEntity.ok(userService.getUserByEmail(authentication.getName()));
    }

    @PutMapping("/profile")
    public ResponseEntity<User> updateUserProfile(
            Authentication authentication,
            @RequestBody User updatedUser) {
        return ResponseEntity.ok(userService.updateUserProfile(authentication.getName(), updatedUser));
    }

    @PutMapping("/password")
    public ResponseEntity<Void> updatePassword(
            Authentication authentication,
            @RequestParam String currentPassword,
            @RequestParam String newPassword) {
        userService.updatePassword(authentication.getName(), currentPassword, newPassword);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/notifications/preferences")
    public ResponseEntity<Void> updateNotificationPreferences(
            Authentication authentication,
            @RequestParam(required = false) Boolean notifyOrders,
            @RequestParam(required = false) Boolean notifyReservations,
            @RequestParam(required = false) Boolean notifyPromotions) {
        userService.updateNotificationPreferences(
                authentication.getName(), notifyOrders, notifyReservations, notifyPromotions);
        return ResponseEntity.ok().build();
    }
}
