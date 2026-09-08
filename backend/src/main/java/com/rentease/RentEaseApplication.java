package com.rentease;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class RentEaseApplication {

    public static void main(String[] args) {
        SpringApplication.run(RentEaseApplication.class, args);
        System.out.println("==================================================================");
        System.out.println("🚀 RentEase Backend REST API successfully started on port 8080!");
        System.out.println("📖 Swagger API Docs: http://localhost:8080/swagger-ui.html");
        System.out.println("💾 H2 Console:        http://localhost:8080/h2-console");
        System.out.println("==================================================================");
    }
}
