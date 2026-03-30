package proyecto.proyecto.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import proyecto.proyecto.dto.PermisoPerfilDTO;
import proyecto.proyecto.service.PermisoPerfilService;
import proyecto.proyecto.service.PermissionService;

@RestController
@RequestMapping("/api/permisos_perfil")
public class PermisoPerfilController {
    @Autowired
    PermisoPerfilService permisoPerfilService;

    @Autowired
    PermissionService permissionService;

    @GetMapping
    public ResponseEntity<?> getAll(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "5") int size) {
        if (!permissionService.hasPermission("Permisos-Perfil", "consulta")) {
            return ResponseEntity.status(403).body("No tiene permiso para consulta");
        }
        return ResponseEntity.ok(permisoPerfilService.getAll(org.springframework.data.domain.PageRequest.of(page, size)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        if (!permissionService.hasPermission("Permisos-Perfil", "detalle")) {
            return ResponseEntity.status(403).body("No tiene permiso para detalle");
        }
        return permisoPerfilService.getById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody PermisoPerfilDTO dto) {
        if (!permissionService.hasPermission("Permisos-Perfil", "agregar")) {
            return ResponseEntity.status(403).body("No tiene permiso para agregar");
        }
        return ResponseEntity.ok(permisoPerfilService.save(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody PermisoPerfilDTO dto) {
        if (!permissionService.hasPermission("Permisos-Perfil", "editar")) {
            return ResponseEntity.status(403).body("No tiene permiso para editar");
        }
        return ResponseEntity.ok(permisoPerfilService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (!permissionService.hasPermission("Permisos-Perfil", "eliminar")) {
            return ResponseEntity.status(403).body("No tiene permiso para eliminar");
        }
        permisoPerfilService.delete(id);
        return ResponseEntity.ok().build();
    }
}
