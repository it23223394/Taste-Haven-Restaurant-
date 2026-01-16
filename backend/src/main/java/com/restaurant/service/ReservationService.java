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
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReservationService {

    private static final int TOTAL_TABLES = 12;

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

        List<Integer> requestedTables = sanitizeTableNumbers(request.getTableNumbers());
        ensureTableAvailability(request.getReservationDateTime(), requestedTables, null);

        Reservation reservation = new Reservation();
        reservation.setUser(user);
        reservation.setReservationDateTime(request.getReservationDateTime());
        reservation.setNumberOfGuests(request.getNumberOfGuests());
        reservation.setSpecialRequests(request.getSpecialRequests());
        reservation.setStatus(Reservation.ReservationStatus.PENDING);
        reservation.setTableNumbers(new LinkedHashSet<>(requestedTables));
        reservation.setTableNumber(requestedTables.get(0));

        Reservation savedReservation = reservationRepository.save(reservation);

        String tableList = formatTableList(requestedTables);

        notificationService.createNotification(
            user,
            "Reservation Confirmation",
            "Your reservation for " + request.getNumberOfGuests() + " guests on " +
                request.getReservationDateTime() + " for tables " + tableList +
                " has been received and is pending confirmation.",
            Notification.NotificationType.RESERVATION_CONFIRMATION
        );

        return savedReservation;
    }

    public List<Integer> getReservedTableNumbers(LocalDateTime reservationDateTime) {
        if (reservationDateTime == null) {
            return Collections.emptyList();
        }
        return collectReservedTables(reservationDateTime, null);
    }

    private void ensureTableAvailability(LocalDateTime reservationDateTime, List<Integer> requestedTables, Long ignoreReservationId) {
        if (reservationDateTime == null || requestedTables == null || requestedTables.isEmpty()) {
            throw new RuntimeException("Reservation date, time, and table selection are required");
        }

        List<Integer> reservedTables = collectReservedTables(reservationDateTime, ignoreReservationId);

        LinkedHashSet<Integer> conflicts = requestedTables.stream()
                .filter(reservedTables::contains)
                .collect(Collectors.toCollection(LinkedHashSet::new));

        if (!conflicts.isEmpty()) {
            throw new RuntimeException("Table(s) " + formatTableList(conflicts) +
                    " are already booked for that slot. Please choose other tables.");
        }

        int available = TOTAL_TABLES - reservedTables.size();
        if (available <= 0) {
            throw new RuntimeException("No tables available for the selected time. Please choose another slot.");
        }

        if (requestedTables.size() > available) {
            throw new RuntimeException("Only " + available + " tables remain available for that slot.");
        }
    }

    private List<Integer> collectReservedTables(LocalDateTime reservationDateTime, Long ignoreReservationId) {
        if (reservationDateTime == null) {
            return Collections.emptyList();
        }
        LocalDateTime startTime = reservationDateTime.minusHours(1);
        LocalDateTime endTime = reservationDateTime.plusHours(1);

        List<Reservation> conflicts = reservationRepository.findConflictingReservations(startTime, endTime);
        if (conflicts.isEmpty()) {
            return Collections.emptyList();
        }

        LinkedHashSet<Integer> reservedTables = new LinkedHashSet<>();
        for (Reservation reservation : conflicts) {
            if (ignoreReservationId != null && reservation.getId() != null && reservation.getId().equals(ignoreReservationId)) {
                continue;
            }
            if (reservation.getTableNumber() != null) {
                reservedTables.add(reservation.getTableNumber());
            }
            if (reservation.getTableNumbers() != null) {
                reservedTables.addAll(reservation.getTableNumbers());
            }
        }

        return new ArrayList<>(reservedTables);
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
        List<Integer> requestedTables = sanitizeTableNumbers(request.getTableNumbers());
        ensureTableAvailability(request.getReservationDateTime(), requestedTables, id);

        reservation.setReservationDateTime(request.getReservationDateTime());
        reservation.setNumberOfGuests(request.getNumberOfGuests());
        reservation.setSpecialRequests(request.getSpecialRequests());
        reservation.setTableNumbers(new LinkedHashSet<>(requestedTables));
        reservation.setTableNumber(requestedTables.get(0));

        return reservationRepository.save(reservation);
    }

    @Transactional
    public Reservation updateReservationStatus(Long id, String status) {
        Reservation reservation = getReservationById(id);
        Reservation.ReservationStatus newStatus = Reservation.ReservationStatus.valueOf(status.toUpperCase());
        reservation.setStatus(newStatus);

        Reservation updatedReservation = reservationRepository.save(reservation);
        String tableList = formatTableList(reservation.getTableNumbers());
        String message = "Your reservation for " + reservation.getReservationDateTime() +
                " for tables " + tableList + " is now " + newStatus.name().toLowerCase() + ".";
        
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

        String tableList = formatTableList(reservation.getTableNumbers());

        notificationService.createNotification(
            reservation.getUser(),
            "Reservation Cancelled",
            "Your reservation for " + reservation.getReservationDateTime() + " for tables " + tableList + " has been cancelled.",
            Notification.NotificationType.RESERVATION_CONFIRMATION
        );
    }

    private List<Integer> sanitizeTableNumbers(List<Integer> tableNumbers) {
        if (tableNumbers == null || tableNumbers.isEmpty()) {
            throw new RuntimeException("Select at least one table");
        }

        LinkedHashSet<Integer> cleaned = new LinkedHashSet<>();
        for (Integer table : tableNumbers) {
            if (table == null) {
                continue;
            }
            if (table < 1 || table > TOTAL_TABLES) {
                throw new RuntimeException("Table numbers must be between 1 and " + TOTAL_TABLES);
            }
            if (!cleaned.add(table)) {
                throw new RuntimeException("Table " + table + " has been selected more than once.");
            }
        }

        return new ArrayList<>(cleaned);
    }

    private String formatTableList(Collection<Integer> tables) {
        if (tables == null || tables.isEmpty()) {
            return "N/A";
        }
        return tables.stream()
                .map(String::valueOf)
                .collect(Collectors.joining(", "));
    }
}
