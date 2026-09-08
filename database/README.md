-- MySQL / Database Setup Instructions for RentEase

## 1. Prerequisites
- MySQL Server 8.0+ running on `localhost:3306` (or Docker container)
- MySQL client or MySQL Workbench

## 2. Fast Setup (One Command)
Run in your terminal or PowerShell:
```bash
mysql -u root -p < schema.sql
mysql -u root -p rentease_db < data.sql
```

## 3. Running with Docker
If you prefer running MySQL in Docker:
```bash
docker run --name rentease-mysql -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=rentease_db -p 3306:3306 -d mysql:8.0
docker exec -i rentease-mysql mysql -uroot -proot < schema.sql
docker exec -i rentease-mysql mysql -uroot -proot rentease_db < data.sql
```

## 4. Connecting the Spring Boot Backend to MySQL
Run the backend with the `mysql` Spring profile:
```bash
cd backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=mysql
```

*(Note: By default, if no MySQL server is running, the backend automatically uses its embedded in-memory H2 database with MySQL compatibility mode so you can run and test immediately without configuring MySQL!)*
