package com.softbridge.sras.security;

import com.softbridge.sras.model.Employee;
import com.softbridge.sras.repository.EmployeeRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

@Service
public class RoleService {

    private final EmployeeRepository employeeRepository;

    public RoleService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    public String normalizeRole(String role) {
        if (role == null) {
            throw new AccessDeniedException("Role is required");
        }

        String normalizedRole = role.trim().toUpperCase();

        if (normalizedRole.equals("HR") || normalizedRole.equals("PM") || normalizedRole.equals("EMPLOYEE")) {
            return normalizedRole;
        }

        throw new AccessDeniedException("Unsupported role");
    }

    public boolean hasRole(Authentication authentication, String role) {
        if (authentication == null) {
            return false;
        }

        String authority = "ROLE_" + role;

        return authentication.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(authority::equals);
    }

    public Employee getCurrentEmployee(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            throw new AccessDeniedException("Authentication is required");
        }

        return employeeRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new AccessDeniedException("Authenticated user was not found"));
    }

    public boolean isCurrentEmployee(Authentication authentication, String employeeId) {
        return getCurrentEmployee(authentication).getEmployeeId().equals(employeeId);
    }
}
