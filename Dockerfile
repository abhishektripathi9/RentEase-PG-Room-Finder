# Multi-stage Dockerfile for RentEase Spring Boot API (Root context)
FROM maven:3.9.6-eclipse-temurin-21-jammy AS build
WORKDIR /app

# Copy Maven descriptor and source code from backend directory
COPY backend/pom.xml ./pom.xml
COPY backend/src ./src

# Build production jar
RUN mvn clean package -DskipTests

# Lightweight runtime stage
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Copy built jar
COPY --from=build /app/target/rentease-api-1.0.0.jar app.jar

ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT} -jar app.jar"]
