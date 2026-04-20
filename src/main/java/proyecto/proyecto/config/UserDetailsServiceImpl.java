package proyecto.proyecto.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import proyecto.proyecto.entity.Usuario;
import proyecto.proyecto.repository.UsuarioRepository;
import proyecto.proyecto.entity.PermisoPerfil;
import proyecto.proyecto.repository.PermisoPerfilRepository;
import proyecto.proyecto.dto.PermisoPerfilDTO;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;
import java.util.HashMap;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    @Autowired
    UsuarioRepository usuarioRepository;

    @Autowired
    PermisoPerfilRepository permisoPerfilRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByStrNombreUsuario(username)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + username));

        if (usuario.getIdEstadoUsuario() == 0) {
            throw new UsernameNotFoundException("User is inactive: " + username);
        }

        List<PermisoPerfil> permisosEntity = permisoPerfilRepository.findByPerfilId(usuario.getPerfil().getId());
        
        // REFUERZO: Filtrar duplicados en memoria por ID mayor si existieran
        Map<Long, PermisoPerfil> latestPermisos = new HashMap<>();
        for (PermisoPerfil p : permisosEntity) {
            Long mid = p.getModulo().getId();
            if (!latestPermisos.containsKey(mid) || p.getId() > latestPermisos.get(mid).getId()) {
                latestPermisos.put(mid, p);
            }
        }

        List<PermisoPerfilDTO> permisosDTO = latestPermisos.values().stream().map(p -> {
            PermisoPerfilDTO dto = new PermisoPerfilDTO();
            dto.setId(p.getId());
            dto.setIdModulo(p.getModulo().getId());
            dto.setNombreModulo(p.getModulo().getStrNombreModulo());
            dto.setIdPerfil(p.getPerfil().getId());
            dto.setBitAgregar(p.isBitAgregar());
            dto.setBitEditar(p.isBitEditar());
            dto.setBitConsulta(p.isBitConsulta());
            dto.setBitEliminar(p.isBitEliminar());
            dto.setBitDetalle(p.isBitDetalle());
            return dto;
        }).collect(Collectors.toList());

        List<SimpleGrantedAuthority> authorities = latestPermisos.values().stream()
                .map(p -> new SimpleGrantedAuthority("ROLE_" + p.getModulo().getStrNombreModulo().toUpperCase()))
                .collect(Collectors.toList());

        return UserDetailsImpl.build(usuario, permisosDTO, authorities);
    }
}
