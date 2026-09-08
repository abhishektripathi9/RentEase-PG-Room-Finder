package com.rentease.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI rentEaseOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("RentEase – PG & Room Finder REST API")
                        .description("Comprehensive full-stack PG and rental housing portal API with filter search, booking workflow, verified listings, owner portal, and map coordinates.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("RentEase Engineering Team")
                                .email("support@rentease.io")
                                .url("https://rentease.io"))
                        .license(new License().name("Apache 2.0").url("https://springdoc.org")));
    }
}
