package com.restaurant.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "menu_items")
@Data
@lombok.ToString(exclude = {"reviews", "orderItems", "cartItems", "favoritedBy"})
@lombok.EqualsAndHashCode(exclude = {"reviews", "orderItems", "cartItems", "favoritedBy"})
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class MenuItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(columnDefinition = "LONGTEXT")
    private String imageUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category;

    private Boolean available = true;

    private Integer preparationTime; // in minutes

    private Double averageRating = 0.0;
    private Integer totalReviews = 0;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "menuItem", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private Set<Review> reviews = new HashSet<>();

    @OneToMany(mappedBy = "menuItem", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private Set<OrderItem> orderItems = new HashSet<>();

    @OneToMany(mappedBy = "menuItem", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private Set<CartItem> cartItems = new HashSet<>();

    @ManyToMany(mappedBy = "favorites")
    @JsonIgnore
    private Set<User> favoritedBy = new HashSet<>();

    public enum Category {
        APPETIZERS,
        MAIN_COURSE,
        DESSERTS,
        BEVERAGES,
        SALADS,
        SOUPS,
        PASTA,
        SEAFOOD,
        VEGETARIAN,
        SPECIALS
    }

    public void updateRating() {
        if (reviews.isEmpty()) {
            this.averageRating = 0.0;
            this.totalReviews = 0;
        } else {
            this.averageRating = reviews.stream()
                    .mapToInt(Review::getRating)
                    .average()
                    .orElse(0.0);
            this.totalReviews = reviews.size();
        }
    }
}
