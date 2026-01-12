# Restaurant Management System

A full-stack restaurant management system with digital ordering, table reservations, menu management, and admin dashboard.

## 🚀 Features

### Customer Features
- **User Authentication**: Secure signup/login with JWT
- **Menu Browsing**: View menu with categories, search, and filtering
- **Shopping Cart**: Add items, customize orders, manage quantities
- **Online Ordering**: Place orders for dine-in, takeaway, or delivery
- **Table Reservations**: Book tables with date/time selection
- **Order Tracking**: Real-time order status updates
- **Reviews & Ratings**: Rate menu items and leave feedback
- **Favorites**: Save favorite dishes
- **Notifications**: Order updates, reservation confirmations, promotions
- **Profile Management**: Update personal info and preferences

### Admin Features
- **Dashboard**: Overview of orders, reservations, revenue, and users
- **Menu Management**: Create, update, delete menu items
- **Order Management**: View and update order statuses
- **Reservation Management**: View and manage table bookings
- **User Management**: View registered users
- **Analytics**: Key business metrics and insights

## 🛠️ Technology Stack

### Backend
- **Framework**: Spring Boot 3.2.1
- **Security**: Spring Security with JWT
- **Database**: MySQL 8.0
- **ORM**: Spring Data JPA / Hibernate
- **Validation**: Bean Validation API
- **Build Tool**: Maven

### Frontend
- **Framework**: React 18.2
- **Routing**: React Router v6
- **State Management**: Context API
- **HTTP Client**: Axios
- **Notifications**: React Toastify
- **Styling**: Custom CSS with CSS Variables

## 📁 Project Structure

```
restaurant/
├── backend/
│   ├── src/main/java/com/restaurant/
│   │   ├── config/          # Security & CORS configuration
│   │   ├── controller/      # REST API endpoints
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── entity/          # JPA entities
│   │   ├── exception/       # Global exception handling
│   │   ├── repository/      # Data access layer
│   │   ├── security/        # JWT & authentication
│   │   └── service/         # Business logic
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/      # Reusable components
    │   ├── context/         # Auth & Cart context
    │   ├── pages/           # Page components
    │   ├── services/        # API services
    │   ├── App.js
    │   └── index.js
    └── package.json
```

## 🚦 Getting Started

### Prerequisites
- Java 17 or higher
- Node.js 16 or higher
- MySQL 8.0 or higher
- Maven 3.6 or higher

### Backend Setup

1. **Create MySQL Database**
```sql
CREATE DATABASE restaurant_db;
```

2. **Configure Database**
   Edit `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/restaurant_db
spring.datasource.username=your_username
spring.datasource.password=your_password
```

3. **Build and Run**
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### Frontend Setup

1. **Install Dependencies**
```bash
cd frontend
npm install
```

2. **Start Development Server**
```bash
npm start
```

The frontend will start on `http://localhost:3000`

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/signup
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "phoneNumber": "1234567890"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "token": "jwt_token_here",
  "id": 1,
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "CUSTOMER"
}
```

### Menu Endpoints

#### Get All Menu Items
```http
GET /api/menu
```

#### Get Menu Item by ID
```http
GET /api/menu/{id}
```

#### Search Menu
```http
GET /api/menu/search?keyword=pasta
```

#### Filter by Category
```http
GET /api/menu/category/MAIN_COURSE
```

### Cart Endpoints (Requires Authentication)

#### Get User Cart
```http
GET /api/cart
Authorization: Bearer {token}
```

#### Add Item to Cart
```http
POST /api/cart/items
Authorization: Bearer {token}
Content-Type: application/json

{
  "menuItemId": 1,
  "quantity": 2,
  "customizations": "Extra cheese, no onions"
}
```

#### Update Quantity
```http
PUT /api/cart/items/{cartItemId}?quantity=3
Authorization: Bearer {token}
```

#### Remove Item
```http
DELETE /api/cart/items/{cartItemId}
Authorization: Bearer {token}
```

### Order Endpoints (Requires Authentication)

#### Create Order
```http
POST /api/orders
Authorization: Bearer {token}
Content-Type: application/json

{
  "orderType": "DINE_IN",
  "deliveryAddress": null,
  "specialInstructions": "No spicy"
}
```

#### Get User Orders
```http
GET /api/orders
Authorization: Bearer {token}
```

### Reservation Endpoints (Requires Authentication)

#### Create Reservation
```http
POST /api/reservations
Authorization: Bearer {token}
Content-Type: application/json

{
  "reservationDateTime": "2026-01-15T19:00:00",
  "numberOfGuests": 4,
  "specialRequests": "Window seat preferred"
}
```

#### Get User Reservations
```http
GET /api/reservations
Authorization: Bearer {token}
```

### Admin Endpoints (Requires ADMIN Role)

#### Get Dashboard Stats
```http
GET /api/admin/dashboard/stats
Authorization: Bearer {admin_token}
```

#### Create Menu Item
```http
POST /api/admin/menu
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "name": "Margherita Pizza",
  "description": "Classic pizza with tomato and mozzarella",
  "price": 12.99,
  "category": "MAIN_COURSE",
  "imageUrl": "https://example.com/pizza.jpg",
  "available": true,
  "preparationTime": 20
}
```

#### Update Order Status
```http
PUT /api/admin/orders/{orderId}/status?status=PREPARING
Authorization: Bearer {admin_token}
```

## 🎨 UI/UX Features

### Restaurant Theme
- **Color Palette**: Warm earth tones (oranges, browns, beige)
- **Typography**: Clean, readable fonts
- **Responsive Design**: Mobile, tablet, and desktop optimized
- **Smooth Animations**: Hover effects and transitions
- **Loading States**: Spinners and feedback
- **Toast Notifications**: Success/error messages

### Key UI Components
- Modern card-based design
- Intuitive navigation bar
- Sticky header for easy access
- Image-rich menu presentation
- Real-time cart updates
- Status badges for orders/reservations

## 🔒 Security Features

- JWT-based authentication
- Password encryption (BCrypt)
- CORS configuration
- Role-based access control (CUSTOMER/ADMIN)
- Input validation
- SQL injection prevention (JPA)
- XSS protection

## 🧪 Testing

### Backend Testing
```bash
cd backend
mvn test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📦 Production Deployment

### Backend Deployment

1. **Build JAR File**
```bash
mvn clean package -DskipTests
```

2. **Run JAR**
```bash
java -jar target/restaurant-management-system-1.0.0.jar
```

3. **Environment Variables**
```bash
export SPRING_DATASOURCE_URL=jdbc:mysql://prod-db:3306/restaurant_db
export SPRING_DATASOURCE_USERNAME=prod_user
export SPRING_DATASOURCE_PASSWORD=prod_password
export JWT_SECRET=your_production_secret_key
```

### Frontend Deployment

1. **Build Production Bundle**
```bash
npm run build
```

2. **Serve with Web Server** (nginx, Apache, or hosting service)
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/build;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:8080;
    }
}
```

## 🌟 Best Practices Implemented

### Backend
- Layered architecture (Controller → Service → Repository)
- DTO pattern for API responses
- Global exception handling
- Input validation
- Transaction management
- Query optimization with JPA

### Frontend
- Component-based architecture
- Context API for state management
- Protected routes
- Error boundaries
- Code splitting
- Lazy loading

## 📝 Database Schema

### Key Tables
- `users` - User accounts
- `menu_items` - Restaurant menu
- `orders` - Customer orders
- `order_items` - Order line items
- `reservations` - Table bookings
- `carts` - Shopping carts
- `cart_items` - Cart line items
- `reviews` - Menu item reviews
- `notifications` - User notifications
- `order_feedback` - Order ratings

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Support

For support, email support@restaurant.com or create an issue in the repository.

## 🎯 Future Enhancements

- [ ] Real-time notifications with WebSocket
- [ ] Payment gateway integration
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Loyalty program
- [ ] Multi-language support
- [ ] Dark mode
- [ ] PWA support
- [ ] Advanced analytics dashboard
- [ ] Inventory management

---

Built with ❤️ for restaurant businesses
