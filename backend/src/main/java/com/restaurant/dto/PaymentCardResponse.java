package com.restaurant.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentCardResponse {

    @JsonProperty("id")
    private Long id;

    @JsonProperty("cardholderName")
    private String cardholderName;

    @JsonProperty("last4Digits")
    private String last4Digits;

    @JsonProperty("cardBrand")
    private String cardBrand;

    @JsonProperty("expiryMonth")
    private Integer expiryMonth;

    @JsonProperty("expiryYear")
    private Integer expiryYear;

    @JsonProperty("isDefault")
    private Boolean isDefault;

    @JsonProperty("isActive")
    private Boolean isActive;

    @JsonProperty("createdAt")
    private LocalDateTime createdAt;
}
