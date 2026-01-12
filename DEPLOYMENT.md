# DEPLOYMENT GUIDE

## Prerequisites

- Java 17+
- Node.js 16+
- MySQL 8.0+
- Domain name (optional)
- SSL certificate (recommended for production)

---

## 🐳 Docker Deployment (Recommended)

### 1. Create Dockerfile for Backend

```dockerfile
# backend/Dockerfile
FROM maven:3.8-openjdk-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### 2. Create Dockerfile for Frontend

```dockerfile
# frontend/Dockerfile
FROM node:16-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 3. Create docker-compose.yml

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: restaurant_db
      MYSQL_USER: restaurant_user
      MYSQL_PASSWORD: restaurant_pass
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
    networks:
      - restaurant-network

  backend:
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/restaurant_db
      SPRING_DATASOURCE_USERNAME: restaurant_user
      SPRING_DATASOURCE_PASSWORD: restaurant_pass
      JWT_SECRET: your_production_jwt_secret_key_here
    depends_on:
      - mysql
    networks:
      - restaurant-network

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - restaurant-network

volumes:
  mysql_data:

networks:
  restaurant-network:
```

### 4. Deploy with Docker Compose

```bash
docker-compose up -d
```

---

## ☁️ AWS Deployment

### Backend (AWS Elastic Beanstalk)

1. **Create JAR file**
```bash
cd backend
mvn clean package -DskipTests
```

2. **Install EB CLI**
```bash
pip install awsebcli
```

3. **Initialize and Deploy**
```bash
eb init -p java-17 restaurant-backend
eb create restaurant-backend-env
eb deploy
```

4. **Set Environment Variables**
```bash
eb setenv SPRING_DATASOURCE_URL=jdbc:mysql://your-rds-endpoint:3306/restaurant_db
eb setenv SPRING_DATASOURCE_USERNAME=admin
eb setenv SPRING_DATASOURCE_PASSWORD=your_password
eb setenv JWT_SECRET=your_jwt_secret
```

### Database (AWS RDS)

1. Create MySQL RDS instance
2. Configure security groups
3. Update backend connection string

### Frontend (AWS S3 + CloudFront)

1. **Build frontend**
```bash
cd frontend
npm run build
```

2. **Create S3 bucket**
```bash
aws s3 mb s3://restaurant-frontend
```

3. **Upload build files**
```bash
aws s3 sync build/ s3://restaurant-frontend
```

4. **Configure S3 for static website hosting**

5. **Create CloudFront distribution** (optional, for CDN)

---

## 🌐 Heroku Deployment

### Backend

1. **Create Heroku app**
```bash
heroku create restaurant-backend
```

2. **Add MySQL addon**
```bash
heroku addons:create cleardb:ignite
```

3. **Set environment variables**
```bash
heroku config:set JWT_SECRET=your_jwt_secret
```

4. **Deploy**
```bash
git subtree push --prefix backend heroku main
```

### Frontend

1. **Create separate Heroku app**
```bash
heroku create restaurant-frontend
```

2. **Add buildpack**
```bash
heroku buildpacks:set mars/create-react-app
```

3. **Deploy**
```bash
git subtree push --prefix frontend heroku main
```

---

## 🖥️ VPS Deployment (Ubuntu)

### 1. Install Prerequisites

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Java 17
sudo apt install openjdk-17-jdk -y

# Install MySQL
sudo apt install mysql-server -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install nodejs -y

# Install Nginx
sudo apt install nginx -y
```

### 2. Setup MySQL

```bash
sudo mysql_secure_installation

# Create database
sudo mysql -u root -p
CREATE DATABASE restaurant_db;
CREATE USER 'restaurant_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON restaurant_db.* TO 'restaurant_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 3. Deploy Backend

```bash
# Upload JAR file
scp target/restaurant-*.jar user@server:/opt/restaurant/

# Create systemd service
sudo nano /etc/systemd/system/restaurant-backend.service
```

```ini
[Unit]
Description=Restaurant Backend
After=network.target

[Service]
User=restaurant
WorkingDirectory=/opt/restaurant
ExecStart=/usr/bin/java -jar /opt/restaurant/restaurant-*.jar
SuccessExitStatus=143
TimeoutStopSec=10
Restart=on-failure
RestartSec=5

Environment="SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/restaurant_db"
Environment="SPRING_DATASOURCE_USERNAME=restaurant_user"
Environment="SPRING_DATASOURCE_PASSWORD=strong_password"
Environment="JWT_SECRET=your_jwt_secret"

[Install]
WantedBy=multi-user.target
```

```bash
# Start service
sudo systemctl daemon-reload
sudo systemctl enable restaurant-backend
sudo systemctl start restaurant-backend
```

### 4. Deploy Frontend

```bash
# Build frontend locally
npm run build

# Upload to server
scp -r build/* user@server:/var/www/restaurant/

# Configure Nginx
sudo nano /etc/nginx/sites-available/restaurant
```

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/restaurant;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/restaurant /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 5. Setup SSL (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

---

## 🔒 Production Security Checklist

- [ ] Change default passwords
- [ ] Use strong JWT secret (256-bit minimum)
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Set up firewall rules
- [ ] Enable MySQL SSL connections
- [ ] Implement rate limiting
- [ ] Set up monitoring and logging
- [ ] Regular security updates
- [ ] Backup database regularly
- [ ] Use environment variables for secrets
- [ ] Disable debug mode
- [ ] Set proper file permissions

---

## 📊 Monitoring

### Application Monitoring

1. **Spring Boot Actuator**
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

2. **Prometheus + Grafana**
```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
```

### Log Aggregation

**Using ELK Stack:**
- Elasticsearch for storage
- Logstash for processing
- Kibana for visualization

---

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy Restaurant App

on:
  push:
    branches: [ main ]

jobs:
  build-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up JDK 17
        uses: actions/setup-java@v2
        with:
          java-version: '17'
      - name: Build with Maven
        run: cd backend && mvn clean package -DskipTests
      - name: Deploy to server
        run: |
          # Add deployment commands

  build-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      - name: Build
        run: cd frontend && npm ci && npm run build
      - name: Deploy to S3
        run: |
          # Add S3 deployment commands
```

---

## 🆘 Troubleshooting

### Backend won't start
- Check MySQL connection
- Verify Java version
- Check logs: `journalctl -u restaurant-backend -f`

### Frontend shows blank page
- Check browser console for errors
- Verify API endpoint configuration
- Check Nginx error logs: `tail -f /var/log/nginx/error.log`

### Database connection issues
- Verify MySQL is running: `sudo systemctl status mysql`
- Check credentials
- Verify firewall rules

---

## 📈 Performance Optimization

1. **Database Indexing**
```sql
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_order_user ON orders(user_id);
CREATE INDEX idx_order_status ON orders(status);
```

2. **Enable Caching**
```java
@EnableCaching
@Cacheable("menuItems")
```

3. **Frontend Optimization**
- Code splitting
- Image optimization
- CDN for static assets
- Gzip compression

---

## 🔐 Backup Strategy

### Database Backup
```bash
# Daily automated backup
0 2 * * * mysqldump -u restaurant_user -p restaurant_db > /backups/restaurant_$(date +\%Y\%m\%d).sql
```

### File Backup
```bash
# Weekly backup
rsync -avz /opt/restaurant/ /backups/app/
```

---

For support, contact devops@restaurant.com
