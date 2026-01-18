package com.restaurant.controller;

import com.restaurant.dto.PaymentCardRequest;
import com.restaurant.dto.PaymentCardResponse;
import com.restaurant.entity.User;
import com.restaurant.service.PaymentCardService;
import com.restaurant.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private PaymentCardService paymentCardService;

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

    // Payment Card Management
    @GetMapping("/payment-cards")
    public ResponseEntity<List<PaymentCardResponse>> getUserPaymentCards(Authentication authentication) {
        return ResponseEntity.ok(paymentCardService.getUserPaymentCards(authentication.getName()));
    }

    @PostMapping("/payment-cards")
    public ResponseEntity<PaymentCardResponse> addPaymentCard(
            Authentication authentication,
            @Valid @RequestBody PaymentCardRequest request) {
        return ResponseEntity.ok(paymentCardService.addPaymentCard(authentication.getName(), request));
    }

    @PutMapping("/payment-cards/{cardId}")
    public ResponseEntity<PaymentCardResponse> updatePaymentCard(
            Authentication authentication,
            @PathVariable Long cardId,
            @Valid @RequestBody PaymentCardRequest request) {
        return ResponseEntity.ok(paymentCardService.updatePaymentCard(authentication.getName(), cardId, request));
    }

    @DeleteMapping("/payment-cards/{cardId}")
    public ResponseEntity<Void> deletePaymentCard(
            Authentication authentication,
            @PathVariable Long cardId) {
        paymentCardService.deletePaymentCard(authentication.getName(), cardId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/payment-cards/default")
    public ResponseEntity<PaymentCardResponse> getDefaultPaymentCard(Authentication authentication) {
        return ResponseEntity.ok(paymentCardService.getDefaultPaymentCard(authentication.getName()));
    }
}
