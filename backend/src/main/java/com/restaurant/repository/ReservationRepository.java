package com.restaurant.repository;

import com.restaurant.entity.Reservation;
import com.restaurant.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByUserOrderByReservationDateTimeDesc(User user);
    
    @Query("SELECT r FROM Reservation r WHERE r.reservationDateTime BETWEEN :startTime AND :endTime " +
           "AND r.status IN ('PENDING', 'CONFIRMED')")
    List<Reservation> findConflictingReservations(LocalDateTime startTime, LocalDateTime endTime);
    
    @Query("SELECT r FROM Reservation r WHERE r.reservationDateTime BETWEEN :startDate AND :endDate")
    List<Reservation> findReservationsBetweenDates(LocalDateTime startDate, LocalDateTime endDate);
    
    List<Reservation> findByStatus(Reservation.ReservationStatus status);
}
