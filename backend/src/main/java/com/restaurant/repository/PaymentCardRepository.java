package com.restaurant.repository;

import com.restaurant.entity.PaymentCard;
import com.restaurant.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentCardRepository extends JpaRepository<PaymentCard, Long> {
    List<PaymentCard> findByUserAndIsActiveTrue(User user);
    Optional<PaymentCard> findByIdAndUser(Long id, User user);
    Optional<PaymentCard> findByUserAndIsDefaultTrue(User user);
    void deleteByIdAndUser(Long id, User user);
}
