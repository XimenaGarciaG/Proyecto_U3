package proyecto.proyecto.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import proyecto.proyecto.dto.LoginRequest;
import proyecto.proyecto.service.AuthService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(authService.authenticateUser(loginRequest));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        Object principal = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof proyecto.proyecto.config.UserDetailsImpl) {
            return ResponseEntity.ok(principal);
        }
        return ResponseEntity.status(401).build();
    }
}
