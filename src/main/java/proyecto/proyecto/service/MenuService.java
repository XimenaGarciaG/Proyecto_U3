package proyecto.proyecto.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import proyecto.proyecto.entity.Menu;
import proyecto.proyecto.entity.PermisoPerfil;
import proyecto.proyecto.repository.MenuRepository;
import proyecto.proyecto.repository.PermisoPerfilRepository;
import proyecto.proyecto.repository.PerfilRepository;
import proyecto.proyecto.dto.MenuDTO;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;
import java.util.HashMap;

@Service
public class MenuService {
    @Autowired
    MenuRepository menuRepository;

    @Autowired
    PermisoPerfilRepository permisoPerfilRepository;

    @Autowired
    PerfilRepository perfilRepository;

    public List<MenuDTO> getMenuForPerfil(Long perfilId) {
        // ADMIN BYPASS
        boolean isAdmin = perfilRepository.findById(perfilId)
                .map(p -> p.isBitAdministrador())
                .orElse(false);

        List<Menu> allMenus = menuRepository.findAll();

        if (isAdmin) {
            // Return full menu hierarchy without filtering
            return allMenus.stream()
                    .filter(m -> m.getIdMenuPadre() == 0)
                    .map(m -> convertToDTOFull(m, allMenus))
                    .collect(Collectors.toList());
        }

        List<PermisoPerfil> permisos = permisoPerfilRepository.findByPerfilId(perfilId);
        
        // REFUERZO: Filtrar duplicados por ID mayor para el mapa de permisos
        Map<Long, Boolean> moduloConConsulta = new HashMap<>();
        for (PermisoPerfil p : permisos) {
            Long mid = p.getModulo().getId();
            if (!moduloConConsulta.containsKey(mid) || p.getId() > 0) { // Aquí simplemente aseguramos que si alguno tiene bitConsulta, se considere
                 if (p.isBitConsulta()) moduloConConsulta.put(mid, true);
            }
        }
        
        List<Long> modulosConPermiso = moduloConConsulta.keySet().stream().collect(Collectors.toList());

        // Build hierarchy with filtering
        List<MenuDTO> rootMenus = allMenus.stream()
                .filter(m -> m.getIdMenuPadre() == 0)
                .map(m -> convertToDTO(m, allMenus, modulosConPermiso))
                .filter(m -> m != null)
                .collect(Collectors.toList());

        return rootMenus;
    }

    private MenuDTO convertToDTOFull(Menu menu, List<Menu> allMenus) {
        MenuDTO dto = new MenuDTO();
        dto.setId(menu.getId());
        dto.setIdMenuPadre(menu.getIdMenuPadre());
        dto.setNombreMenu(menu.getStrNombreMenu());
        
        if (menu.getModulo() != null) {
            dto.setIdModulo(menu.getModulo().getId());
            dto.setNombreModulo(menu.getModulo().getStrNombreModulo());
        }

        List<MenuDTO> subMenus = allMenus.stream()
                .filter(m -> m.getIdMenuPadre().equals(menu.getId()))
                .map(m -> convertToDTOFull(m, allMenus))
                .collect(Collectors.toList());

        dto.setSubMenus(subMenus);
        return dto;
    }

    private MenuDTO convertToDTO(Menu menu, List<Menu> allMenus, List<Long> modulosConPermiso) {
        MenuDTO dto = new MenuDTO();
        dto.setId(menu.getId());
        dto.setIdMenuPadre(menu.getIdMenuPadre());
        dto.setNombreMenu(menu.getStrNombreMenu());
        
        if (menu.getModulo() != null) {
            dto.setIdModulo(menu.getModulo().getId());
            dto.setNombreModulo(menu.getModulo().getStrNombreModulo());
        }

        List<MenuDTO> subMenus = allMenus.stream()
                .filter(m -> m.getIdMenuPadre().equals(menu.getId()))
                .map(m -> convertToDTO(m, allMenus, modulosConPermiso))
                .filter(m -> m != null)
                .collect(Collectors.toList());

        dto.setSubMenus(subMenus);

        // Check if this menu or any of its submenus have permissions
        boolean hasPermission = menu.getModulo() != null && modulosConPermiso.contains(menu.getModulo().getId());
        boolean hasSubMenuWithPermission = !subMenus.isEmpty();

        if (hasPermission || hasSubMenuWithPermission) {
            return dto;
        } else {
            return null;
        }
    }
}
