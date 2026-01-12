package com.restaurant.repository;

import com.restaurant.entity.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    List<MenuItem> findByCategory(MenuItem.Category category);
    List<MenuItem> findByAvailable(Boolean available);
    
    @Query("SELECT m FROM MenuItem m WHERE LOWER(m.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(m.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<MenuItem> searchByKeyword(String keyword);
    
    List<MenuItem> findByCategoryAndAvailable(MenuItem.Category category, Boolean available);
}
