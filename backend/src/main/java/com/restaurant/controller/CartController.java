package com.restaurant.controller;

import com.restaurant.dto.CartItemRequest;
import com.restaurant.entity.Cart;
import com.restaurant.service.CartService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping
    public ResponseEntity<Cart> getUserCart(Authentication authentication) {
        return ResponseEntity.ok(cartService.getUserCart(authentication.getName()));
    }

    @PostMapping("/items")
    public ResponseEntity<Cart> addItemToCart(
            Authentication authentication,
            @Valid @RequestBody CartItemRequest request) {
        return ResponseEntity.ok(cartService.addItemToCart(authentication.getName(), request));
    }

    @PutMapping("/items/{cartItemId}")
    public ResponseEntity<Cart> updateCartItemQuantity(
            Authentication authentication,
            @PathVariable Long cartItemId,
            @RequestParam Integer quantity) {
        return ResponseEntity.ok(cartService.updateCartItemQuantity(
                authentication.getName(), cartItemId, quantity));
    }

    @DeleteMapping("/items/{cartItemId}")
    public ResponseEntity<Cart> removeItemFromCart(
            Authentication authentication,
            @PathVariable Long cartItemId) {
        return ResponseEntity.ok(cartService.removeItemFromCart(authentication.getName(), cartItemId));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart(Authentication authentication) {
        cartService.clearCart(authentication.getName());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/total")
    public ResponseEntity<BigDecimal> getCartTotal(Authentication authentication) {
        return ResponseEntity.ok(cartService.getCartTotal(authentication.getName()));
    }
}
