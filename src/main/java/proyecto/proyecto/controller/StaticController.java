package proyecto.proyecto.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/static")
public class StaticController {

    @GetMapping("/modulo/{id}")
    public ResponseEntity<?> getStaticModuleData(@PathVariable String id) {
        Map<String, String> data = new HashMap<>();
        data.put("id", id);
        data.put("status", "Funcionalidad en desarrollo");
        data.put("message", "Simulación de datos para módulo estático " + id);
        return ResponseEntity.ok(data);
    }
}
