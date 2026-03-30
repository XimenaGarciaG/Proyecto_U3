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
import java.util.List;
import java.util.stream.Collectors;
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
        Usuario usuario = usuarioRepository.findByStrNombreUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + username));

        if (usuario.getIdEstadoUsuario() == 0) {
            throw new UsernameNotFoundException("User is inactive: " + username);
        }

        List<PermisoPerfil> permisos = permisoPerfilRepository.findByPerfilId(usuario.getPerfil().getId());
        
        List<SimpleGrantedAuthority> authorities = permisos.stream()
                .map(p -> new SimpleGrantedAuthority("ROLE_" + p.getModulo().getStrNombreModulo().toUpperCase()))
                .collect(Collectors.toList());

        return UserDetailsImpl.build(usuario, authorities);
    }
}
