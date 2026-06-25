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

                        .requestMatchers(HttpMethod.GET, "/pms")
                        .hasRole("HR")

                        .requestMatchers(HttpMethod.GET, "/employees")
                        .hasRole("HR")

                        .requestMatchers(HttpMethod.GET, "/employees/**")
                        .hasAnyRole("HR", "EMPLOYEE")

                        .requestMatchers(HttpMethod.POST, "/employees/**")
                        .hasRole("HR")

                        .requestMatchers(HttpMethod.PUT, "/employees/**")
                        .hasAnyRole("HR", "EMPLOYEE")

                        .requestMatchers(HttpMethod.DELETE, "/employees/**")
                        .hasRole("HR")

                        .requestMatchers(HttpMethod.GET, "/skills/me")
                        .hasRole("EMPLOYEE")

                        .requestMatchers(HttpMethod.POST, "/skills/me")
                        .hasRole("EMPLOYEE")

                        .requestMatchers(HttpMethod.PUT, "/skills/me/**")
                        .hasRole("EMPLOYEE")

                        .requestMatchers(HttpMethod.DELETE, "/skills/me/**")
                        .hasRole("EMPLOYEE")

                        .requestMatchers("/skills/**")
                        .hasRole("HR")

                        .requestMatchers(HttpMethod.GET, "/projects/my")
                        .hasRole("PM")

                        .requestMatchers(HttpMethod.PUT, "/projects/my/*/status")
                        .hasRole("PM")

                        .requestMatchers(HttpMethod.DELETE, "/projects/my/*/team/*")
                        .hasRole("PM")

                        .requestMatchers(HttpMethod.GET, "/projects/employee")
                        .hasRole("EMPLOYEE")

                        .requestMatchers(HttpMethod.POST, "/projects")
                        .hasRole("HR")

                        .requestMatchers(HttpMethod.GET, "/projects")
                        .hasRole("HR")

                        .requestMatchers(HttpMethod.PUT, "/projects/*/pm/*")
                        .hasRole("HR")

                        .requestMatchers(HttpMethod.PUT, "/projects/*/pm")
                        .hasRole("HR")

                        .requestMatchers(HttpMethod.PUT, "/projects/*/status")
                        .hasRole("PM")

                        .requestMatchers(HttpMethod.POST, "/projects/*/assign/*")
                        .hasAnyRole("PM", "HR")

                        .requestMatchers(HttpMethod.GET, "/projects/*/team")
                        .hasAnyRole("PM", "HR")

                        .requestMatchers(HttpMethod.DELETE, "/projects/*/team/*")
                        .hasAnyRole("PM", "HR")

                        .requestMatchers(HttpMethod.DELETE, "/projects/*")
                        .hasRole("HR")

                        .requestMatchers(HttpMethod.PUT, "/projects/*/complete")
                        .hasRole("PM")

                        .requestMatchers(HttpMethod.PUT, "/projects/*/change-team")
                        .hasRole("PM")

                        .requestMatchers("/projects/**")
                        .hasRole("HR")

                        .requestMatchers("/allocations/**")
                        .hasRole("HR")

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
