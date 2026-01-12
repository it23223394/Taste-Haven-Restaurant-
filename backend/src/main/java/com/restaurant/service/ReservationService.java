package com.restaurant.service;

import com.restaurant.dto.ReservationRequest;
import com.restaurant.entity.Notification;
import com.restaurant.entity.Reservation;
import com.restaurant.entity.User;
import com.restaurant.repository.ReservationRepository;
import com.restaurant.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    @Transactional
    public Reservation createReservation(String userEmail, ReservationRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check for conflicts (basic availability check)
        LocalDateTime startTime = request.getReservationDateTime().minusHours(1);
        LocalDateTime endTime = request.getReservationDateTime().plusHours(1);
        
        List<Reservation> conflicts = reservationRepository.findConflictingReservations(startTime, endTime);
        
        // Simple check - if more than 10 reservations in time slot, reject
        if (conflicts.size() >= 10) {
            throw new RuntimeException("No tables available for the selected time. Please choose another time.");
        }

        Reservation reservation = new Reservation();
        reservation.setUser(user);
        reservation.setReservationDateTime(request.getReservationDateTime());
        reservation.setNumberOfGuests(request.getNumberOfGuests());
        reservation.setSpecialRequests(request.getSpecialRequests());
        reservation.setStatus(Reservation.ReservationStatus.PENDING);

        Reservation savedReservation = reservationRepository.save(reservation);

        // Send confirmation notification
        notificationService.createNotification(
                user,
                "Reservation Confirmation",
                "Your reservation for " + request.getNumberOfGuests() + " guests on " + 
                request.getReservationDateTime() + " has been received and is pending confirmation.",
                Notification.NotificationType.RESERVATION_CONFIRMATION
        );

        return savedReservation;
    }

    public List<Reservation> getUserReservations(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return reservationRepository.findByUserOrderByReservationDateTimeDesc(user);
    }

    public Reservation getReservationById(Long id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));
    }

    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    @Transactional
    public Reservation updateReservation(Long id, ReservationRequest request) {
        Reservation reservation = getReservationById(id);
        
        reservation.setReservationDateTime(request.getReservationDateTime());
        reservation.setNumberOfGuests(request.getNumberOfGuests());
        reservation.setSpecialRequests(request.getSpecialRequests());

        return reservationRepository.save(reservation);
    }

    @Transactional
    public Reservation updateReservationStatus(Long id, String status) {
        Reservation reservation = getReservationById(id);
        Reservation.ReservationStatus newStatus = Reservation.ReservationStatus.valueOf(status.toUpperCase());
        reservation.setStatus(newStatus);

        Reservation updatedReservation = reservationRepository.save(reservation);

        // Send notification
        String message = "Your reservation for " + reservation.getReservationDateTime() + 
                        " is now " + newStatus.name().toLowerCase();
        
        notificationService.createNotification(
                reservation.getUser(),
                "Reservation Status Update",
                message,
                Notification.NotificationType.RESERVATION_CONFIRMATION
        );

        return updatedReservation;
    }

    @Transactional
    public void cancelReservation(Long id) {
        Reservation reservation = getReservationById(id);
        reservation.setStatus(Reservation.ReservationStatus.CANCELLED);
        reservationRepository.save(reservation);

        notificationService.createNotification(
                reservation.getUser(),
                "Reservation Cancelled",
                "Your reservation for " + reservation.getReservationDateTime() + " has been cancelled.",
                Notification.NotificationType.RESERVATION_CONFIRMATION
        );
    }
}
