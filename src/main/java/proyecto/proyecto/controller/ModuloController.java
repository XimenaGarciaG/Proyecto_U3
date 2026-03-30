package proyecto.proyecto.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import proyecto.proyecto.entity.Modulo;
import proyecto.proyecto.service.ModuloService;
import proyecto.proyecto.service.PermissionService;

@RestController
@RequestMapping("/api/modulo")
public class ModuloController {
    @Autowired
    ModuloService moduloService;

    @Autowired
    PermissionService permissionService;

    @GetMapping
    public ResponseEntity<?> getAll(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "5") int size) {
        if (!permissionService.hasPermission("Modulo", "consulta")) {
            return ResponseEntity.status(403).body("No tiene permiso para consulta");
        }
        return ResponseEntity.ok(moduloService.getAll(PageRequest.of(page, size)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        if (!permissionService.hasPermission("Modulo", "detalle")) {
            return ResponseEntity.status(403).body("No tiene permiso para detalle");
        }
        return moduloService.getById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Modulo modulo) {
        if (!permissionService.hasPermission("Modulo", "agregar")) {
            return ResponseEntity.status(403).body("No tiene permiso para agregar");
        }
        return ResponseEntity.ok(moduloService.save(modulo));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Modulo modulo) {
        if (!permissionService.hasPermission("Modulo", "editar")) {
            return ResponseEntity.status(403).body("No tiene permiso para editar");
        }
        modulo.setId(id);
        return ResponseEntity.ok(moduloService.save(modulo));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (!permissionService.hasPermission("Modulo", "eliminar")) {
            return ResponseEntity.status(403).body("No tiene permiso para eliminar");
        }
        moduloService.delete(id);
        return ResponseEntity.ok().build();
    }
}
