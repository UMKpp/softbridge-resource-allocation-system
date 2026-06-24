package com.softbridge.sras.auth;

import com.softbridge.sras.dto.LoginRequest;
import com.softbridge.sras.dto.LoginResponse;
import com.softbridge.sras.model.Employee;
import com.softbridge.sras.repository.EmployeeRepository;
import com.softbridge.sras.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final JwtService jwtService;
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(JwtService jwtService,
                          EmployeeRepository employeeRepository,
                          PasswordEncoder passwordEncoder) {
        this.jwtService = jwtService;
        this.employeeRepository = employeeRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {

        Employee employee = employeeRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid username or password"));

        boolean passwordMatches = passwordEncoder.matches(
                request.getPassword(),
                employee.getPassword()
        );

        if (!passwordMatches) {
            throw new RuntimeException("Invalid username or password");
        }

        String token = jwtService.generateToken(employee.getUsername());

        return new LoginResponse(token);
    }
}