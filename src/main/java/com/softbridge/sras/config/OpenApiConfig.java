package com.softbridge.sras.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI srasOpenAPI() {

        return new OpenAPI()
                .info(new Info()
                        .title("SoftBridge Resource Allocation System API")
                        .version("1.0")
                        .description(
                                "API documentation for employee, skill, project, and resource allocation management."
                        ));
    }
}