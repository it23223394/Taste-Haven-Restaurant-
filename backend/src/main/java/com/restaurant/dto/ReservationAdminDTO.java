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
public class ReservationAdminDTO {
    
    private Long id;
    
    @JsonProperty("customerName")
    private String customerName;
    
    @JsonProperty("customerEmail")
    private String customerEmail;
    
    @JsonProperty("customerPhone")
    private String customerPhone;
    
    @JsonProperty("partySize")
    private Integer partySize;
    
    @JsonProperty("reservationDateTime")
    private LocalDateTime reservationDateTime;
    
    @JsonProperty("status")
    private String status;
    
    @JsonProperty("specialRequests")
    private String specialRequests;
    
    @JsonProperty("tableNumber")
    private Integer tableNumber;
    
    @JsonProperty("createdAt")
    private LocalDateTime createdAt;
    
    @JsonProperty("updatedAt")
    private LocalDateTime updatedAt;
}
