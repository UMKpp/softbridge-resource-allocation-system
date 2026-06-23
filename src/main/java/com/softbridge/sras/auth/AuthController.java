package com.softbridge.sras.auth;

import com.softbridge.sras.dto.LoginRequest;
import com.softbridge.sras.dto.LoginResponse;
import com.softbridge.sras.security.JwtService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final JwtService jwtService;

    public AuthController(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {

        String token = jwtService.generateToken(request.getUsername());

        return new LoginResponse(token);
    }
}