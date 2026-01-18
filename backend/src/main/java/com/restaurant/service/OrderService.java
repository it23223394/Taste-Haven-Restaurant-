package com.restaurant.service;

import com.restaurant.dto.OrderRequest;
import com.restaurant.dto.OrderResponse;
import com.restaurant.entity.*;
import com.restaurant.repository.CartRepository;
import com.restaurant.repository.OrderRepository;
import com.restaurant.repository.PaymentCardRepository;
import com.restaurant.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private PaymentCardRepository paymentCardRepository;

    @Autowired
    private NotificationService notificationService;

    @Transactional
    public OrderResponse createOrder(String userEmail, OrderRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // Validate payment card if provided
        PaymentCard paymentCard = null;
        if (request.getPaymentCardId() != null) {
            paymentCard = paymentCardRepository.findByIdAndUser(request.getPaymentCardId(), user)
                    .orElseThrow(() -> new RuntimeException("Payment card not found or does not belong to user"));
            
            if (!paymentCard.getIsActive()) {
                throw new RuntimeException("Payment card is not active");
            }
        }

        Order order = new Order();
        order.setUser(user);
        order.setPaymentCard(paymentCard);
        order.setType(Order.OrderType.valueOf(request.getOrderType().toUpperCase()));
        order.setDeliveryAddress(request.getDeliveryAddress());
        order.setSpecialInstructions(request.getSpecialInstructions());
        order.setStatus(Order.OrderStatus.PENDING);

        // Convert cart items to order items
        cart.getItems().forEach(cartItem -> {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setMenuItem(cartItem.getMenuItem());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(cartItem.getMenuItem().getPrice());
            orderItem.setCustomizations(cartItem.getCustomizations());
            order.getOrderItems().add(orderItem);
        });

        order.calculateTotal();
        order.setEstimatedCompletionTime(LocalDateTime.now().plusMinutes(30));

        Order savedOrder = orderRepository.save(order);

        // Clear cart
        cart.clearCart();
        cartRepository.save(cart);

        // Send notification
        notificationService.createNotification(
                user,
                "Order Placed Successfully",
                "Your order #" + savedOrder.getId() + " has been placed successfully. Total: $" + savedOrder.getTotalAmount(),
                Notification.NotificationType.ORDER_UPDATE
        );

        return OrderResponse.fromEntity(savedOrder);
    }

    public List<OrderResponse> getUserOrders(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return orderRepository.findByUserOrderByOrderedAtDesc(user).stream()
                .map(OrderResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public OrderResponse getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return OrderResponse.fromEntity(order);
    }

    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(OrderResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        Order.OrderStatus newStatus = Order.OrderStatus.valueOf(status.toUpperCase());
        order.setStatus(newStatus);
        Order updatedOrder = orderRepository.save(order);

        // Send notification based on status
        String message = "Order #" + orderId + " is now " + newStatus.name().toLowerCase();
        if (newStatus == Order.OrderStatus.READY) {
            message = "Your order #" + orderId + " is ready for pickup!";
        }

        notificationService.createNotification(
                order.getUser(),
                "Order Status Update",
                message,
                Notification.NotificationType.ORDER_UPDATE
        );

        return OrderResponse.fromEntity(updatedOrder);
    }

    public List<OrderResponse> getOrdersByStatus(String status) {
        Order.OrderStatus orderStatus = Order.OrderStatus.valueOf(status.toUpperCase());
        return orderRepository.findByStatus(orderStatus).stream()
                .map(OrderResponse::fromEntity)
                .collect(Collectors.toList());
    }
}
