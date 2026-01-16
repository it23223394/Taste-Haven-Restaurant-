package com.restaurant.controller;

import com.restaurant.dto.CartItemRequest;
import com.restaurant.dto.CartResponse;
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
    public ResponseEntity<CartResponse> getUserCart(Authentication authentication) {
        Cart cart = cartService.getUserCart(authentication.getName());
        return ResponseEntity.ok(CartResponse.fromCart(cart));
    }

    @PostMapping("/items")
    public ResponseEntity<CartResponse> addItemToCart(
            Authentication authentication,
            @Valid @RequestBody CartItemRequest request) {
        CartResponse cart = cartService.addItemToCart(authentication.getName(), request);
        return ResponseEntity.ok(cart);
    }

    @PutMapping("/items/{cartItemId}")
    public ResponseEntity<CartResponse> updateCartItemQuantity(
            Authentication authentication,
            @PathVariable Long cartItemId,
            @RequestParam Integer quantity) {
        CartResponse cart = cartService.updateCartItemQuantity(
                authentication.getName(), cartItemId, quantity);
        return ResponseEntity.ok(cart);
    }

    @DeleteMapping("/items/{cartItemId}")
    public ResponseEntity<CartResponse> removeItemFromCart(
            Authentication authentication,
            @PathVariable Long cartItemId) {
        CartResponse cart = cartService.removeItemFromCart(authentication.getName(), cartItemId);
        return ResponseEntity.ok(cart);
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
