import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  signup: (userData) => api.post('/auth/signup', userData),
  forgotPassword: (email) => api.post(`/auth/forgot-password?email=${email}`),
  resetPassword: (token, newPassword) => 
    api.post(`/auth/reset-password?token=${token}&newPassword=${newPassword}`),
};

// Menu API
export const menuAPI = {
  getAllItems: () => api.get('/menu'),
  getItemById: (id) => api.get(`/menu/${id}`),
  getByCategory: (category) => api.get(`/menu/category/${category}`),
  search: (keyword) => api.get(`/menu/search?keyword=${keyword}`),
  toggleFavorite: (menuItemId) => api.post(`/menu/favorites/${menuItemId}`),
  getFavorites: () => api.get('/menu/favorites'),
};

// Cart API
export const cartAPI = {
  getCart: () => api.get('/cart'),
  addItem: (item) => api.post('/cart/items', item),
  updateQuantity: (cartItemId, quantity) => 
    api.put(`/cart/items/${cartItemId}?quantity=${quantity}`),
  removeItem: (cartItemId) => api.delete(`/cart/items/${cartItemId}`),
  clearCart: () => api.delete('/cart/clear'),
  getTotal: () => api.get('/cart/total'),
};

// Order API
export const orderAPI = {
  createOrder: (orderData) => api.post('/orders', orderData),
  placeOrder: (orderData) => api.post('/orders', orderData),
  getUserOrders: () => api.get('/orders'),
  getOrderById: (orderId) => api.get(`/orders/${orderId}`),
};

// Reservation API
export const reservationAPI = {
  createReservation: (reservationData) => api.post('/reservations', reservationData),
  getUserReservations: () => api.get('/reservations'),
  getReservationById: (id) => api.get(`/reservations/${id}`),
  updateReservation: (id, data) => api.put(`/reservations/${id}`, data),
  cancelReservation: (id) => api.delete(`/reservations/${id}`),
  getReservedTables: (dateTime) =>
    api.get(`/reservations/availability?dateTime=${encodeURIComponent(dateTime)}`),
};

// Review API
export const reviewAPI = {
  createReview: (reviewData) => api.post('/reviews', reviewData),
  getMenuItemReviews: (menuItemId) => api.get(`/reviews/menu-item/${menuItemId}`),
  getUserReviews: () => api.get('/reviews/user'),
  deleteReview: (reviewId) => api.delete(`/reviews/${reviewId}`),
};

// Notification API
export const notificationAPI = {
  getAll: () => api.get('/notifications'),
  getUnread: () => api.get('/notifications/unread'),
  getUnreadCount: () => api.get('/notifications/unread/count'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
};

// User API
export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (userData) => api.put('/user/profile', userData),
  updatePassword: (currentPassword, newPassword) => 
    api.put(`/user/password?currentPassword=${currentPassword}&newPassword=${newPassword}`),
  updateNotificationPreferences: (preferences) => 
    api.put('/user/notifications/preferences', null, { params: preferences }),
  
  // Payment Cards
  getPaymentCards: () => api.get('/user/payment-cards'),
  addPaymentCard: (cardData) => api.post('/user/payment-cards', cardData),
  updatePaymentCard: (cardId, cardData) => api.put(`/user/payment-cards/${cardId}`, cardData),
  deletePaymentCard: (cardId) => api.delete(`/user/payment-cards/${cardId}`),
  getDefaultPaymentCard: () => api.get('/user/payment-cards/default'),
};

// Admin API
export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  
  // Menu Management
  getAllMenuItems: () => api.get('/admin/menu'),
  createMenuItem: (item) => api.post('/admin/menu', item),
  updateMenuItem: (id, item) => api.put(`/admin/menu/${id}`, item),
  deleteMenuItem: (id) => api.delete(`/admin/menu/${id}`),
  
  // Order Management
  getAllOrders: () => api.get('/admin/orders'),
  getOrdersByStatus: (status) => api.get(`/admin/orders/status/${status}`),
  updateOrderStatus: (orderId, status) => 
    api.put(`/admin/orders/${orderId}/status?status=${status}`),
  
  // Reservation Management
  getAllReservations: () => api.get('/admin/reservations'),
  updateReservationStatus: (id, status) => 
    api.put(`/admin/reservations/${id}/status?status=${status}`),
  
  // User Management
  getAllUsers: () => api.get('/admin/users'),
  createUser: (user) => api.post('/admin/users', user),
  updateUserRole: (userId, role) => api.put(`/admin/users/${userId}/role?role=${role}`),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
};

export default api;
