package com.restaurant.dto;

import com.restaurant.entity.MenuItem;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItemResponse {
    private Long id;
    private MenuItem menuItem;
    private Integer quantity;
    private String customizations;
}
