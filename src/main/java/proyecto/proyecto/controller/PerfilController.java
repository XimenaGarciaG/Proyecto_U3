package proyecto.proyecto.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import proyecto.proyecto.entity.Perfil;
import proyecto.proyecto.service.PerfilService;
import proyecto.proyecto.service.PermissionService;

@RestController
@RequestMapping("/api/perfil")
public class PerfilController {
    @Autowired
    PerfilService perfilService;

    @Autowired
    PermissionService permissionService;

    @GetMapping
    public ResponseEntity<?> getAll(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "5") int size) {
        if (!permissionService.hasPermission("Perfil", "consulta")) {
            return ResponseEntity.status(403).body("No tiene permiso para consulta");
        }
        return ResponseEntity.ok(perfilService.getAll(PageRequest.of(page, size)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        if (!permissionService.hasPermission("Perfil", "detalle")) {
            return ResponseEntity.status(403).body("No tiene permiso para detalle");
        }
        return perfilService.getById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Perfil perfil) {
        if (!permissionService.hasPermission("Perfil", "agregar")) {
            return ResponseEntity.status(403).body("No tiene permiso para agregar");
        }
        return ResponseEntity.ok(perfilService.save(perfil));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Perfil perfil) {
        if (!permissionService.hasPermission("Perfil", "editar")) {
            return ResponseEntity.status(403).body("No tiene permiso para editar");
        }
        perfil.setId(id);
        return ResponseEntity.ok(perfilService.save(perfil));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (!permissionService.hasPermission("Perfil", "eliminar")) {
            return ResponseEntity.status(403).body("No tiene permiso para eliminar");
        }
        perfilService.delete(id);
        return ResponseEntity.ok().build();
    }
}
