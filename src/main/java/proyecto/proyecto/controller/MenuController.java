package proyecto.proyecto.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import proyecto.proyecto.config.UserDetailsImpl;
import proyecto.proyecto.service.MenuService;

@RestController
@RequestMapping("/api/menu")
public class MenuController {
    @Autowired
    MenuService menuService;

    @GetMapping
    public ResponseEntity<?> getMenu() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetailsImpl) {
            UserDetailsImpl userDetails = (UserDetailsImpl) principal;
            return ResponseEntity.ok(menuService.getMenuForPerfil(userDetails.getPerfilId()));
        }
        return ResponseEntity.status(401).build();
    }
}
