package proyecto.proyecto.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import proyecto.proyecto.entity.Menu;
import proyecto.proyecto.entity.PermisoPerfil;
import proyecto.proyecto.repository.MenuRepository;
import proyecto.proyecto.repository.PermisoPerfilRepository;
import proyecto.proyecto.dto.MenuDTO;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MenuService {
    @Autowired
    MenuRepository menuRepository;

    @Autowired
    PermisoPerfilRepository permisoPerfilRepository;

    public List<MenuDTO> getMenuForPerfil(Long perfilId) {
        List<PermisoPerfil> permisos = permisoPerfilRepository.findByPerfilId(perfilId);
        List<Long> modulosConPermiso = permisos.stream()
                .filter(p -> p.isBitConsulta())
                .map(p -> p.getModulo().getId())
                .collect(Collectors.toList());

        List<Menu> allMenus = menuRepository.findAll();
        
        // Build hierarchy
        List<MenuDTO> rootMenus = allMenus.stream()
                .filter(m -> m.getIdMenuPadre() == 0)
                .map(m -> convertToDTO(m, allMenus, modulosConPermiso))
                .filter(m -> m != null)
                .collect(Collectors.toList());

        return rootMenus;
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
