package proyecto.proyecto.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import proyecto.proyecto.config.UserDetailsImpl;
import proyecto.proyecto.entity.PermisoPerfil;
import proyecto.proyecto.repository.PermisoPerfilRepository;
import proyecto.proyecto.repository.ModuloRepository;
import proyecto.proyecto.repository.PerfilRepository;
import java.util.Optional;

@Service
public class PermissionService {
    @Autowired
    PermisoPerfilRepository permisoPerfilRepository;

    @Autowired
    ModuloRepository moduloRepository;
    
    @Autowired
    PerfilRepository perfilRepository;

    public boolean hasPermission(String moduloNombre, String accion) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetailsImpl) {
            UserDetailsImpl userDetails = (UserDetailsImpl) principal;
            Long perfilId = userDetails.getPerfilId();
            
            // This is a bit inefficient to do every time, but required for simplicity here
            // In a real app, we might cache this or use Spring Security authorities
            Optional<PermisoPerfil> permiso = permisoPerfilRepository.findAll().stream()
                    .filter(p -> p.getPerfil().getId().equals(perfilId) && p.getModulo().getStrNombreModulo().equalsIgnoreCase(moduloNombre))
                    .findFirst();

            if (permiso.isPresent()) {
                PermisoPerfil p = permiso.get();
                switch (accion.toLowerCase()) {
                    case "agregar": return p.isBitAgregar();
                    case "editar": return p.isBitEditar();
                    case "consulta": return p.isBitConsulta();
                    case "eliminar": return p.isBitEliminar();
                    case "detalle": return p.isBitDetalle();
                    default: return false;
                }
            }
        }
        return false;
    }
}
