package com.restaurant.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "reservations")
@Data
@lombok.ToString(exclude = {"user"})
@lombok.EqualsAndHashCode(exclude = {"user"})
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private LocalDateTime reservationDateTime;

    @Column(nullable = false)
    private Integer numberOfGuests;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReservationStatus status = ReservationStatus.PENDING;

    private String specialRequests;

    private Integer tableNumber;

    @ElementCollection
    @CollectionTable(name = "reservation_tables", joinColumns = @JoinColumn(name = "reservation_id"))
    @Column(name = "table_number")
    private Set<Integer> tableNumbers = new HashSet<>();

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    public enum ReservationStatus {
        PENDING,
        CONFIRMED,
        SEATED,
        COMPLETED,
        CANCELLED,
        NO_SHOW
    }
}
