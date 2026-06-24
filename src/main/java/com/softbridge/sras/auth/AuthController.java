package com.softbridge.sras.auth;

import com.softbridge.sras.dto.LoginRequest;
import com.softbridge.sras.dto.LoginResponse;
import com.softbridge.sras.model.Employee;
import com.softbridge.sras.repository.EmployeeRepository;
import com.softbridge.sras.security.JwtService;
import com.softbridge.sras.security.RoleService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.softbridge.sras.exception.AuthenticationFailedException;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final JwtService jwtService;
    private final RoleService roleService;
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(JwtService jwtService,
                          RoleService roleService,
                          EmployeeRepository employeeRepository,
                          PasswordEncoder passwordEncoder) {
        this.jwtService = jwtService;
        this.roleService = roleService;
        this.employeeRepository = employeeRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {

        Employee employee = employeeRepository.findByUsername(request.getUsername())
                .orElseThrow(() ->
                        new AuthenticationFailedException("Invalid username or password"));

        boolean passwordMatches = passwordEncoder.matches(
                request.getPassword(),
                employee.getPassword()
        );

        if (!passwordMatches) {
            throw new AuthenticationFailedException("Invalid username or password");
        }

        String role = roleService.normalizeRole(employee.getUserType());

        String token = jwtService.generateToken(
                employee.getUsername(),
                role
        );

        return new LoginResponse(token, role, employee.getEmployeeId());
    }
}
