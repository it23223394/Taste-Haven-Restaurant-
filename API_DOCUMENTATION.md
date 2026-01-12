# API ENDPOINTS REFERENCE

## Base URL
```
Development: http://localhost:8080/api
Production: https://your-domain.com/api
```

## Authentication

All authenticated endpoints require the `Authorization` header:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## 🔐 Authentication Endpoints

### Register New User
**POST** `/auth/signup`

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123",
  "phoneNumber": "1234567890"
}
```

**Response:** `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "id": 1,
  "email": "john.doe@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "CUSTOMER"
}
```

---

### Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

**Response:** `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "id": 1,
  "email": "john.doe@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "CUSTOMER"
}
```

---

### Forgot Password
**POST** `/auth/forgot-password?email={email}`

**Response:** `200 OK`
```json
{
  "message": "Password reset link has been sent to your email"
}
```

---

### Reset Password
**POST** `/auth/reset-password?token={token}&newPassword={newPassword}`

**Response:** `200 OK`
```json
{
  "message": "Password has been reset successfully"
}
```

---

## 🍽️ Menu Endpoints

### Get All Available Menu Items
**GET** `/menu`

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "name": "Margherita Pizza",
    "description": "Classic Italian pizza",
    "price": 12.99,
    "imageUrl": "https://...",
    "category": "MAIN_COURSE",
    "available": true,
    "preparationTime": 20,
    "averageRating": 4.5,
    "totalReviews": 25
  }
]
```

---

### Get Menu Item by ID
**GET** `/menu/{id}`

---

### Get Items by Category
**GET** `/menu/category/{category}`

**Categories:** `APPETIZERS`, `MAIN_COURSE`, `DESSERTS`, `BEVERAGES`, `SALADS`, `SOUPS`, `PASTA`, `SEAFOOD`, `VEGETARIAN`, `SPECIALS`

---

### Search Menu
**GET** `/menu/search?keyword={keyword}`

---

### Toggle Favorite (Authenticated)
**POST** `/menu/favorites/{menuItemId}`

---

### Get User Favorites (Authenticated)
**GET** `/menu/favorites`

---

## 🛒 Cart Endpoints (Authenticated)

### Get User Cart
**GET** `/cart`

**Response:** `200 OK`
```json
{
  "id": 1,
  "items": [
    {
      "id": 1,
      "menuItem": { /* MenuItem object */ },
      "quantity": 2,
      "customizations": "Extra cheese"
    }
  ],
  "createdAt": "2026-01-12T10:00:00",
  "updatedAt": "2026-01-12T10:30:00"
}
```

---

### Add Item to Cart
**POST** `/cart/items`

**Request Body:**
```json
{
  "menuItemId": 1,
  "quantity": 2,
  "customizations": "Extra cheese, no onions"
}
```

---

### Update Item Quantity
**PUT** `/cart/items/{cartItemId}?quantity={quantity}`

---

### Remove Item from Cart
**DELETE** `/cart/items/{cartItemId}`

---

### Clear Cart
**DELETE** `/cart/clear`

---

### Get Cart Total
**GET** `/cart/total`

**Response:** `200 OK`
```json
25.98
```

---

## 📦 Order Endpoints (Authenticated)

### Create Order
**POST** `/orders`

**Request Body:**
```json
{
  "orderType": "DINE_IN",
  "deliveryAddress": null,
  "specialInstructions": "No spicy food"
}
```

**Order Types:** `DINE_IN`, `TAKEAWAY`, `DELIVERY`

**Response:** `200 OK`
```json
{
  "id": 1,
  "totalAmount": 25.98,
  "status": "PENDING",
  "type": "DINE_IN",
  "orderItems": [ /* OrderItem objects */ ],
  "orderedAt": "2026-01-12T12:00:00",
  "estimatedCompletionTime": "2026-01-12T12:30:00"
}
```

---

### Get User Orders
**GET** `/orders`

**Response:** Array of Order objects

---

### Get Order by ID
**GET** `/orders/{orderId}`

---

## 🪑 Reservation Endpoints (Authenticated)

### Create Reservation
**POST** `/reservations`

**Request Body:**
```json
{
  "reservationDateTime": "2026-01-15T19:00:00",
  "numberOfGuests": 4,
  "specialRequests": "Window seat preferred"
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "reservationDateTime": "2026-01-15T19:00:00",
  "numberOfGuests": 4,
  "status": "PENDING",
  "specialRequests": "Window seat preferred",
  "createdAt": "2026-01-12T10:00:00"
}
```

---

### Get User Reservations
**GET** `/reservations`

---

### Get Reservation by ID
**GET** `/reservations/{id}`

---

### Update Reservation
**PUT** `/reservations/{id}`

**Request Body:** Same as Create Reservation

---

### Cancel Reservation
**DELETE** `/reservations/{id}`

---

## ⭐ Review Endpoints (Authenticated)

### Create Review
**POST** `/reviews`

**Request Body:**
```json
{
  "menuItemId": 1,
  "rating": 5,
  "comment": "Absolutely delicious!"
}
```

---

### Get Menu Item Reviews
**GET** `/reviews/menu-item/{menuItemId}`

---

### Get User Reviews
**GET** `/reviews/user`

---

### Delete Review
**DELETE** `/reviews/{reviewId}`

---

## 🔔 Notification Endpoints (Authenticated)

### Get All Notifications
**GET** `/notifications`

---

### Get Unread Notifications
**GET** `/notifications/unread`

---

### Get Unread Count
**GET** `/notifications/unread/count`

**Response:** `200 OK`
```json
5
```

---

### Mark as Read
**PUT** `/notifications/{id}/read`

---

### Mark All as Read
**PUT** `/notifications/read-all`

---

## 👤 User Profile Endpoints (Authenticated)

### Get User Profile
**GET** `/user/profile`

---

### Update Profile
**PUT** `/user/profile`

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "0987654321"
}
```

---

### Update Password
**PUT** `/user/password?currentPassword={current}&newPassword={new}`

---

### Update Notification Preferences
**PUT** `/user/notifications/preferences?notifyOrders=true&notifyReservations=true&notifyPromotions=false`

---

## 🔧 Admin Endpoints (Requires ADMIN Role)

### Dashboard Stats
**GET** `/admin/dashboard/stats`

**Response:** `200 OK`
```json
{
  "totalOrders": 150,
  "totalReservations": 75,
  "totalUsers": 200,
  "totalMenuItems": 50
}
```

---

### Menu Management

**GET** `/admin/menu` - Get all menu items (including unavailable)

**POST** `/admin/menu` - Create menu item
```json
{
  "name": "New Dish",
  "description": "Delicious new item",
  "price": 15.99,
  "category": "MAIN_COURSE",
  "imageUrl": "https://...",
  "available": true,
  "preparationTime": 25
}
```

**PUT** `/admin/menu/{id}` - Update menu item

**DELETE** `/admin/menu/{id}` - Delete menu item

---

### Order Management

**GET** `/admin/orders` - Get all orders

**GET** `/admin/orders/status/{status}` - Get orders by status

**PUT** `/admin/orders/{orderId}/status?status={status}` - Update order status

**Order Statuses:** `PENDING`, `CONFIRMED`, `PREPARING`, `READY`, `COMPLETED`, `CANCELLED`

---

### Reservation Management

**GET** `/admin/reservations` - Get all reservations

**PUT** `/admin/reservations/{id}/status?status={status}` - Update reservation status

**Reservation Statuses:** `PENDING`, `CONFIRMED`, `SEATED`, `COMPLETED`, `CANCELLED`, `NO_SHOW`

---

### User Management

**GET** `/admin/users` - Get all users

---

## Error Responses

### 400 Bad Request
```json
{
  "status": 400,
  "message": "Validation error message",
  "timestamp": "2026-01-12T10:00:00"
}
```

### 401 Unauthorized
```json
{
  "status": 401,
  "message": "Invalid email or password",
  "timestamp": "2026-01-12T10:00:00"
}
```

### 403 Forbidden
```json
{
  "status": 403,
  "message": "Access denied",
  "timestamp": "2026-01-12T10:00:00"
}
```

### 404 Not Found
```json
{
  "status": 404,
  "message": "Resource not found",
  "timestamp": "2026-01-12T10:00:00"
}
```

### 500 Internal Server Error
```json
{
  "status": 500,
  "message": "An error occurred: ...",
  "timestamp": "2026-01-12T10:00:00"
}
```

---

## Rate Limiting

Currently no rate limiting is implemented. For production, consider:
- 100 requests per minute for authenticated endpoints
- 20 requests per minute for authentication endpoints
- 1000 requests per hour per IP

---

## CORS Configuration

Allowed Origins: Configured in `application.properties`
Allowed Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH
Allowed Headers: All (*)
