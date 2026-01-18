package com.restaurant.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentCardRequest {

    @NotBlank(message = "Cardholder name is required")
    private String cardholderName;

    @NotBlank(message = "Card number is required")
    @Pattern(regexp = "\\d{13,19}", message = "Card number must be valid")
    private String cardNumber;

    @NotNull(message = "Expiry month is required")
    private Integer expiryMonth;

    @NotNull(message = "Expiry year is required")
    private Integer expiryYear;

    @NotBlank(message = "CVV is required")
    @Pattern(regexp = "\\d{3,4}", message = "CVV must be 3-4 digits")
    private String cvv;

    private Boolean setAsDefault = false;
}
