package com.restaurant.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequest {
    
    @NotBlank(message = "Order type is required")
    private String orderType; // DINE_IN, TAKEAWAY, DELIVERY
    
    private String deliveryAddress;
    private String specialInstructions;
}
