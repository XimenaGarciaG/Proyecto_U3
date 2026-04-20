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
            
            // BYPASS ADMIN EN BACKEND
            if (userDetails.isBitAdministrador()) {
                return true;
            }

            Long perfilId = userDetails.getPerfilId();
            
            Optional<PermisoPerfil> permiso = permisoPerfilRepository.findByPerfilAndModulo(
                    perfilRepository.findById(perfilId).orElse(null),
                    moduloRepository.findByStrNombreModuloIgnoreCase(moduloNombre.trim()).orElse(null)
            );

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
