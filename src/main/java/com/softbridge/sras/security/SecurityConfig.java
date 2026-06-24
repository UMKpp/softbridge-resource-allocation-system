package com.softbridge.sras.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/auth/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/api-docs/**"
                        ).permitAll()

                        .requestMatchers(HttpMethod.GET, "/employees/**")
                        .hasAnyRole("HR", "PM", "EMPLOYEE")

                        .requestMatchers(HttpMethod.POST, "/employees/**")
                        .hasRole("HR")

                        .requestMatchers(HttpMethod.PUT, "/employees/**")
                        .hasAnyRole("HR", "EMPLOYEE")

                        .requestMatchers(HttpMethod.DELETE, "/employees/**")
                        .hasRole("HR")

                        .requestMatchers("/skills/**")
                        .hasRole("HR")

                        .requestMatchers("/projects/**", "/allocations/**")
                        .hasAnyRole("HR", "PM")

                        .requestMatchers(HttpMethod.GET, "/employee-skills/employees/search")
                        .hasAnyRole("HR", "PM")

                        .requestMatchers(HttpMethod.GET, "/employee-skills/employee/**")
                        .hasAnyRole("HR", "PM", "EMPLOYEE")

                        .requestMatchers("/employee-skills/**")
                        .hasRole("HR")

                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
