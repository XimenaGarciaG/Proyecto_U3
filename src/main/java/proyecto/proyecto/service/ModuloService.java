package proyecto.proyecto.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import proyecto.proyecto.entity.Menu;
import proyecto.proyecto.entity.Modulo;
import proyecto.proyecto.entity.PermisoPerfil;
import proyecto.proyecto.repository.MenuRepository;
import proyecto.proyecto.repository.ModuloRepository;
import proyecto.proyecto.repository.PerfilRepository;
import proyecto.proyecto.repository.PermisoPerfilRepository;
import java.util.Optional;

@Service
@Transactional
public class ModuloService {
    @Autowired
    ModuloRepository moduloRepository;
    
    @Autowired
    MenuRepository menuRepository;
    
    @Autowired
    PerfilRepository perfilRepository;
    
    @Autowired
    PermisoPerfilRepository permisoPerfilRepository;

    public Page<Modulo> getAll(Pageable pageable) {
        return moduloRepository.findAll(pageable);
    }

    public Optional<Modulo> getById(Long id) {
        return moduloRepository.findById(id);
    }

    public Modulo save(Modulo modulo) {
        boolean isNew = modulo.getId() == null;
        Modulo saved = moduloRepository.save(modulo);
        
        if (isNew) {
            // Auto-create Menu entry under "Seguridad" or Root
            Long parentId = menuRepository.findByStrNombreMenu("Seguridad")
                    .map(Menu::getId)
                    .orElse(0L);
            
            Menu menuEntry = Menu.builder()
                    .idMenuPadre(parentId)
                    .strNombreMenu(saved.getStrNombreModulo())
                    .modulo(saved)
                    .build();
            menuRepository.save(menuEntry);
            
            // Auto-create full Permissions for "Administrador" profile
            perfilRepository.findByStrNombrePerfil("Administrador").ifPresent(adminPerfil -> {
                PermisoPerfil permiso = PermisoPerfil.builder()
                        .modulo(saved)
                        .perfil(adminPerfil)
                        .bitAgregar(true)
                        .bitEditar(true)
                        .bitConsulta(true)
                        .bitEliminar(true)
                        .bitDetalle(true)
                        .build();
                permisoPerfilRepository.save(permiso);
            });
        }
        
        return saved;
    }

    public void delete(Long id) {
        moduloRepository.deleteById(id);
    }
}
