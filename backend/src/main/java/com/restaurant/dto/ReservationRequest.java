package com.restaurant.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservationRequest {
    
    @NotNull(message = "Reservation date and time is required")
    @Future(message = "Reservation must be in the future")
    private LocalDateTime reservationDateTime;
    
    @NotNull(message = "Number of guests is required")
    @Positive(message = "Number of guests must be positive")
    private Integer numberOfGuests;

    @NotEmpty(message = "Select at least one table")
    private List<@Positive(message = "Table numbers must be positive") Integer> tableNumbers;
    
    private String specialRequests;
}
