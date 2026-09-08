# Multi-stage Dockerfile for RentEase Spring Boot API (Render deployment)
FROM maven:3.9.6-eclipse-temurin-21-jammy AS build
WORKDIR /app

# Copy Maven descriptor and source code
COPY pom.xml .
COPY src ./src

# Build production jar skipping test suite for fast builds
RUN mvn clean package -DskipTests

# Lightweight runtime stage
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Copy the built jar from the build stage
COPY --from=build /app/target/rentease-api-1.0.0.jar app.jar

# Render passes dynamic PORT environment variable (default 8080)
ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT} -jar app.jar"]
