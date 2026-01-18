package com.restaurant.service;

import com.restaurant.dto.PaymentCardRequest;
import com.restaurant.dto.PaymentCardResponse;
import com.restaurant.entity.PaymentCard;
import com.restaurant.entity.User;
import com.restaurant.repository.PaymentCardRepository;
import com.restaurant.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaymentCardService {

    @Autowired
    private PaymentCardRepository paymentCardRepository;

    @Autowired
    private UserRepository userRepository;

    public List<PaymentCardResponse> getUserPaymentCards(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return paymentCardRepository.findByUserAndIsActiveTrue(user).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public PaymentCardResponse addPaymentCard(String userEmail, PaymentCardRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Validate expiry date
        if (request.getExpiryMonth() < 1 || request.getExpiryMonth() > 12) {
            throw new RuntimeException("Invalid expiry month");
        }

        if (request.getExpiryYear() < LocalDateTime.now().getYear()) {
            throw new RuntimeException("Card has expired");
        }

        // Extract brand from card number
        String cardBrand = detectCardBrand(request.getCardNumber());
        String last4Digits = request.getCardNumber().substring(request.getCardNumber().length() - 4);

        // In production, encrypt the card number or use a payment gateway token
        String cardToken = encryptCardNumber(request.getCardNumber());

        PaymentCard card = new PaymentCard();
        card.setUser(user);
        card.setCardholderName(request.getCardholderName());
        card.setCardToken(cardToken);
        card.setLast4Digits(last4Digits);
        card.setCardBrand(cardBrand);
        card.setExpiryMonth(request.getExpiryMonth());
        card.setExpiryYear(request.getExpiryYear());
        card.setIsActive(true);

        // If this is the first card or user wants it as default
        if (request.getSetAsDefault()) {
            // Unset previous default
            paymentCardRepository.findByUserAndIsDefaultTrue(user).ifPresent(defaultCard -> {
                defaultCard.setIsDefault(false);
                paymentCardRepository.save(defaultCard);
            });
            card.setIsDefault(true);
        } else if (paymentCardRepository.findByUserAndIsDefaultTrue(user).isEmpty()) {
            // If no default card exists, make this one default
            card.setIsDefault(true);
        }

        PaymentCard savedCard = paymentCardRepository.save(card);
        return convertToResponse(savedCard);
    }

    @Transactional
    public PaymentCardResponse updatePaymentCard(String userEmail, Long cardId, PaymentCardRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        PaymentCard card = paymentCardRepository.findByIdAndUser(cardId, user)
                .orElseThrow(() -> new RuntimeException("Payment card not found"));

        card.setCardholderName(request.getCardholderName());
        card.setExpiryMonth(request.getExpiryMonth());
        card.setExpiryYear(request.getExpiryYear());
        card.setUpdatedAt(LocalDateTime.now());

        if (request.getSetAsDefault()) {
            paymentCardRepository.findByUserAndIsDefaultTrue(user).ifPresent(defaultCard -> {
                if (!defaultCard.getId().equals(cardId)) {
                    defaultCard.setIsDefault(false);
                    paymentCardRepository.save(defaultCard);
                }
            });
            card.setIsDefault(true);
        }

        PaymentCard updatedCard = paymentCardRepository.save(card);
        return convertToResponse(updatedCard);
    }

    @Transactional
    public void deletePaymentCard(String userEmail, Long cardId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        PaymentCard card = paymentCardRepository.findByIdAndUser(cardId, user)
                .orElseThrow(() -> new RuntimeException("Payment card not found"));

        if (card.getIsDefault()) {
            // If this is the default card, make the first available card default
            List<PaymentCard> otherCards = paymentCardRepository.findByUserAndIsActiveTrue(user);
            if (!otherCards.isEmpty()) {
                otherCards.get(0).setIsDefault(true);
                paymentCardRepository.save(otherCards.get(0));
            }
        }

        card.setIsActive(false);
        paymentCardRepository.save(card);
    }

    public PaymentCardResponse getDefaultPaymentCard(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return paymentCardRepository.findByUserAndIsDefaultTrue(user)
                .map(this::convertToResponse)
                .orElse(null);
    }

    private PaymentCardResponse convertToResponse(PaymentCard card) {
        return PaymentCardResponse.builder()
                .id(card.getId())
                .cardholderName(card.getCardholderName())
                .last4Digits(card.getLast4Digits())
                .cardBrand(card.getCardBrand())
                .expiryMonth(card.getExpiryMonth())
                .expiryYear(card.getExpiryYear())
                .isDefault(card.getIsDefault())
                .isActive(card.getIsActive())
                .createdAt(card.getCreatedAt())
                .build();
    }

    private String detectCardBrand(String cardNumber) {
        cardNumber = cardNumber.replaceAll("\\s", "");
        if (cardNumber.matches("^4[0-9]{12}(?:[0-9]{3})?$")) {
            return "VISA";
        } else if (cardNumber.matches("^5[1-5][0-9]{14}$|^2(?:22[1-9]|[23]\\d{2}|4[01]\\d|5[0-8]\\d)[0-9]{12}$")) {
            return "MASTERCARD";
        } else if (cardNumber.matches("^3[47][0-9]{13}$")) {
            return "AMEX";
        } else if (cardNumber.matches("^6(?:011|5[0-9]{2})[0-9]{12}$")) {
            return "DISCOVER";
        }
        return "UNKNOWN";
    }

    private String encryptCardNumber(String cardNumber) {
        // In production, use actual encryption or payment gateway tokenization
        // For now, just hash/mask it
        return "card_" + cardNumber.substring(cardNumber.length() - 4) + "_" + System.nanoTime();
    }
}
