package com.restaurant.dto;

import com.restaurant.entity.Order;
import com.restaurant.entity.OrderItem;
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
public class OrderResponse {
    private Long id;
    private UserSummary user;
    private BigDecimal totalAmount;
    private String status;
    private String type;
    private String deliveryAddress;
    private String specialInstructions;
    private LocalDateTime estimatedCompletionTime;
    private LocalDateTime orderedAt;
    private List<OrderItemResponse> orderItems;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserSummary {
        private Long id;
        private String firstName;
        private String lastName;
        private String email;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemResponse {
        private Long id;
        private MenuItemSummary menuItem;
        private Integer quantity;
        private BigDecimal price;
        private String customizations;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MenuItemSummary {
        private Long id;
        private String name;
        private BigDecimal price;
        private String imageUrl;
    }

    public static OrderResponse fromEntity(Order order) {
        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        
        UserSummary userSummary = new UserSummary();
        userSummary.setId(order.getUser().getId());
        userSummary.setFirstName(order.getUser().getFirstName());
        userSummary.setLastName(order.getUser().getLastName());
        userSummary.setEmail(order.getUser().getEmail());
        response.setUser(userSummary);
        
        response.setTotalAmount(order.getTotalAmount());
        response.setStatus(order.getStatus().name());
        response.setType(order.getType().name());
        response.setDeliveryAddress(order.getDeliveryAddress());
        response.setSpecialInstructions(order.getSpecialInstructions());
        response.setEstimatedCompletionTime(order.getEstimatedCompletionTime());
        response.setOrderedAt(order.getOrderedAt());
        
        List<OrderItemResponse> items = order.getOrderItems().stream()
            .map(item -> {
                OrderItemResponse itemResponse = new OrderItemResponse();
                itemResponse.setId(item.getId());
                itemResponse.setQuantity(item.getQuantity());
                itemResponse.setPrice(item.getPrice());
                itemResponse.setCustomizations(item.getCustomizations());
                
                MenuItemSummary menuItemSummary = new MenuItemSummary();
                menuItemSummary.setId(item.getMenuItem().getId());
                menuItemSummary.setName(item.getMenuItem().getName());
                menuItemSummary.setPrice(item.getMenuItem().getPrice());
                menuItemSummary.setImageUrl(item.getMenuItem().getImageUrl());
                itemResponse.setMenuItem(menuItemSummary);
                
                return itemResponse;
            })
            .collect(Collectors.toList());
        response.setOrderItems(items);
        
        return response;
    }
}
