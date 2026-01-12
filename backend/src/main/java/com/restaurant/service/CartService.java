package com.restaurant.service;

import com.restaurant.dto.CartItemRequest;
import com.restaurant.entity.Cart;
import com.restaurant.entity.CartItem;
import com.restaurant.entity.MenuItem;
import com.restaurant.entity.User;
import com.restaurant.repository.CartRepository;
import com.restaurant.repository.MenuItemRepository;
import com.restaurant.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MenuItemRepository menuItemRepository;

    public Cart getUserCart(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return cartRepository.findByUser(user)
                .orElseGet(() -> {
                    Cart cart = new Cart();
                    cart.setUser(user);
                    return cartRepository.save(cart);
                });
    }

    @Transactional
    public Cart addItemToCart(String userEmail, CartItemRequest request) {
        Cart cart = getUserCart(userEmail);
        MenuItem menuItem = menuItemRepository.findById(request.getMenuItemId())
                .orElseThrow(() -> new RuntimeException("Menu item not found"));

        if (!menuItem.getAvailable()) {
            throw new RuntimeException("Menu item is not available");
        }

        // Check if item already exists in cart
        CartItem existingItem = cart.getItems().stream()
                .filter(item -> item.getMenuItem().getId().equals(menuItem.getId()) &&
                        (request.getCustomizations() == null || 
                         request.getCustomizations().equals(item.getCustomizations())))
                .findFirst()
                .orElse(null);

        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + request.getQuantity());
        } else {
            CartItem cartItem = new CartItem();
            cartItem.setCart(cart);
            cartItem.setMenuItem(menuItem);
            cartItem.setQuantity(request.getQuantity());
            cartItem.setCustomizations(request.getCustomizations());
            cart.getItems().add(cartItem);
        }

        return cartRepository.save(cart);
    }

    @Transactional
    public Cart updateCartItemQuantity(String userEmail, Long cartItemId, Integer quantity) {
        Cart cart = getUserCart(userEmail);
        
        CartItem cartItem = cart.getItems().stream()
                .filter(item -> item.getId().equals(cartItemId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (quantity <= 0) {
            cart.getItems().remove(cartItem);
        } else {
            cartItem.setQuantity(quantity);
        }

        return cartRepository.save(cart);
    }

    @Transactional
    public Cart removeItemFromCart(String userEmail, Long cartItemId) {
        Cart cart = getUserCart(userEmail);
        
        cart.getItems().removeIf(item -> item.getId().equals(cartItemId));

        return cartRepository.save(cart);
    }

    @Transactional
    public void clearCart(String userEmail) {
        Cart cart = getUserCart(userEmail);
        cart.clearCart();
        cartRepository.save(cart);
    }

    public BigDecimal getCartTotal(String userEmail) {
        Cart cart = getUserCart(userEmail);
        return cart.getItems().stream()
                .map(item -> item.getMenuItem().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
