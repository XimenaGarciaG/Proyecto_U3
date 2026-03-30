package proyecto.proyecto.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import proyecto.proyecto.dto.UsuarioDTO;
import proyecto.proyecto.service.UsuarioService;
import proyecto.proyecto.service.PermissionService;

@RestController
@RequestMapping("/api/usuario")
public class UsuarioController {
    @Autowired
    UsuarioService usuarioService;

    @Autowired
    PermissionService permissionService;

    @GetMapping
    public ResponseEntity<?> getAll(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "5") int size) {
        if (!permissionService.hasPermission("Usuario", "consulta")) {
            return ResponseEntity.status(403).body("No tiene permiso para consulta");
        }
        return ResponseEntity.ok(usuarioService.getAll(PageRequest.of(page, size)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        if (!permissionService.hasPermission("Usuario", "detalle")) {
            return ResponseEntity.status(403).body("No tiene permiso para detalle");
        }
        return usuarioService.getById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody UsuarioDTO dto) {
        if (!permissionService.hasPermission("Usuario", "agregar")) {
            return ResponseEntity.status(403).body("No tiene permiso para agregar");
        }
        return ResponseEntity.ok(usuarioService.save(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody UsuarioDTO dto) {
        if (!permissionService.hasPermission("Usuario", "editar")) {
            return ResponseEntity.status(403).body("No tiene permiso para editar");
        }
        return ResponseEntity.ok(usuarioService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (!permissionService.hasPermission("Usuario", "eliminar")) {
            return ResponseEntity.status(403).body("No tiene permiso para eliminar");
        }
        usuarioService.delete(id);
        return ResponseEntity.ok().build();
    }
}
