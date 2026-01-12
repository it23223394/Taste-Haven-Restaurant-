package com.restaurant.service;

import com.restaurant.dto.MenuItemRequest;
import com.restaurant.entity.MenuItem;
import com.restaurant.entity.User;
import com.restaurant.repository.MenuItemRepository;
import com.restaurant.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
public class MenuService {

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Autowired
    private UserRepository userRepository;

    public List<MenuItem> getAllMenuItems() {
        return menuItemRepository.findAll();
    }

    public List<MenuItem> getAvailableMenuItems() {
        return menuItemRepository.findByAvailable(true);
    }

    public MenuItem getMenuItemById(Long id) {
        return menuItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Menu item not found with id: " + id));
    }

    public List<MenuItem> getMenuItemsByCategory(String category) {
        MenuItem.Category cat = MenuItem.Category.valueOf(category.toUpperCase());
        return menuItemRepository.findByCategory(cat);
    }

    public List<MenuItem> searchMenuItems(String keyword) {
        return menuItemRepository.searchByKeyword(keyword);
    }

    @Transactional
    public MenuItem createMenuItem(MenuItemRequest request) {
        MenuItem menuItem = new MenuItem();
        menuItem.setName(request.getName());
        menuItem.setDescription(request.getDescription());
        menuItem.setPrice(request.getPrice());
        menuItem.setImageUrl(request.getImageUrl());
        menuItem.setCategory(MenuItem.Category.valueOf(request.getCategory().toUpperCase()));
        menuItem.setAvailable(request.getAvailable() != null ? request.getAvailable() : true);
        menuItem.setPreparationTime(request.getPreparationTime());

        return menuItemRepository.save(menuItem);
    }

    @Transactional
    public MenuItem updateMenuItem(Long id, MenuItemRequest request) {
        MenuItem menuItem = getMenuItemById(id);
        
        menuItem.setName(request.getName());
        menuItem.setDescription(request.getDescription());
        menuItem.setPrice(request.getPrice());
        menuItem.setImageUrl(request.getImageUrl());
        menuItem.setCategory(MenuItem.Category.valueOf(request.getCategory().toUpperCase()));
        menuItem.setAvailable(request.getAvailable());
        menuItem.setPreparationTime(request.getPreparationTime());

        return menuItemRepository.save(menuItem);
    }

    @Transactional
    public void deleteMenuItem(Long id) {
        MenuItem menuItem = getMenuItemById(id);
        menuItemRepository.delete(menuItem);
    }

    @Transactional
    public void toggleFavorite(String userEmail, Long menuItemId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        MenuItem menuItem = getMenuItemById(menuItemId);

        Set<MenuItem> favorites = user.getFavorites();
        if (favorites.contains(menuItem)) {
            favorites.remove(menuItem);
        } else {
            favorites.add(menuItem);
        }
        userRepository.save(user);
    }

    public Set<MenuItem> getUserFavorites(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getFavorites();
    }
}
