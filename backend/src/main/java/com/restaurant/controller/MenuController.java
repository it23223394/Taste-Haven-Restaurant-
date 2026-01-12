package com.restaurant.controller;

import com.restaurant.dto.MenuItemRequest;
import com.restaurant.entity.MenuItem;
import com.restaurant.service.MenuService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/menu")
public class MenuController {

    @Autowired
    private MenuService menuService;

    @GetMapping
    public ResponseEntity<List<MenuItem>> getAllMenuItems() {
        return ResponseEntity.ok(menuService.getAvailableMenuItems());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MenuItem> getMenuItemById(@PathVariable Long id) {
        return ResponseEntity.ok(menuService.getMenuItemById(id));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<MenuItem>> getMenuItemsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(menuService.getMenuItemsByCategory(category));
    }

    @GetMapping("/search")
    public ResponseEntity<List<MenuItem>> searchMenuItems(@RequestParam String keyword) {
        return ResponseEntity.ok(menuService.searchMenuItems(keyword));
    }

    @PostMapping("/favorites/{menuItemId}")
    public ResponseEntity<Void> toggleFavorite(
            Authentication authentication,
            @PathVariable Long menuItemId) {
        menuService.toggleFavorite(authentication.getName(), menuItemId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/favorites")
    public ResponseEntity<Set<MenuItem>> getUserFavorites(Authentication authentication) {
        return ResponseEntity.ok(menuService.getUserFavorites(authentication.getName()));
    }
}
