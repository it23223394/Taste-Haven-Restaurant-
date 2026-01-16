package com.restaurant.controller;

import com.restaurant.dto.ReservationRequest;
import com.restaurant.entity.Reservation;
import com.restaurant.service.ReservationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    @PostMapping
    public ResponseEntity<Reservation> createReservation(
            Authentication authentication,
            @Valid @RequestBody ReservationRequest request) {
        return ResponseEntity.ok(reservationService.createReservation(authentication.getName(), request));
    }

    @GetMapping("/availability")
    public ResponseEntity<List<Integer>> getReservedTables(
            @RequestParam("dateTime")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateTime) {
        return ResponseEntity.ok(reservationService.getReservedTableNumbers(dateTime));
    }

    @GetMapping
    public ResponseEntity<List<Reservation>> getUserReservations(Authentication authentication) {
        return ResponseEntity.ok(reservationService.getUserReservations(authentication.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reservation> getReservationById(@PathVariable Long id) {
        return ResponseEntity.ok(reservationService.getReservationById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Reservation> updateReservation(
            @PathVariable Long id,
            @Valid @RequestBody ReservationRequest request) {
        return ResponseEntity.ok(reservationService.updateReservation(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelReservation(@PathVariable Long id) {
        reservationService.cancelReservation(id);
        return ResponseEntity.ok().build();
    }
}
