package com.restaurant.dto;

import com.restaurant.entity.CartItem;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartResponse {
    private Long id;
    private List<CartItemResponse> items;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private BigDecimal total;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CartItemResponse {
        private Long id;
        private MenuItemSummary menuItem;
        private Integer quantity;
        private String customizations;
        private BigDecimal subtotal;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MenuItemSummary {
        private Long id;
        private String name;
        private String description;
        private BigDecimal price;
        private String imageUrl;
        private Boolean available;
    }

    public static CartResponse fromCart(com.restaurant.entity.Cart cart) {
        CartResponse response = new CartResponse();
        response.setId(cart.getId());
        response.setCreatedAt(cart.getCreatedAt());
        response.setUpdatedAt(cart.getUpdatedAt());
        
        List<CartItemResponse> itemResponses = cart.getItems().stream()
            .map(CartResponse::fromCartItem)
            .collect(Collectors.toList());
        
        response.setItems(itemResponses);
        
        BigDecimal total = itemResponses.stream()
            .map(CartItemResponse::getSubtotal)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        response.setTotal(total);
        
        return response;
    }

    private static CartItemResponse fromCartItem(CartItem item) {
        CartItemResponse response = new CartItemResponse();
        response.setId(item.getId());
        response.setQuantity(item.getQuantity());
        response.setCustomizations(item.getCustomizations());
        
        MenuItemSummary menuItemSummary = new MenuItemSummary();
        menuItemSummary.setId(item.getMenuItem().getId());
        menuItemSummary.setName(item.getMenuItem().getName());
        menuItemSummary.setDescription(item.getMenuItem().getDescription());
        menuItemSummary.setPrice(item.getMenuItem().getPrice());
        menuItemSummary.setImageUrl(item.getMenuItem().getImageUrl());
        menuItemSummary.setAvailable(item.getMenuItem().getAvailable());
        
        response.setMenuItem(menuItemSummary);
        
        BigDecimal subtotal = item.getMenuItem().getPrice()
            .multiply(BigDecimal.valueOf(item.getQuantity()));
        response.setSubtotal(subtotal);
        
        return response;
    }
}
