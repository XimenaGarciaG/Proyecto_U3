package proyecto.proyecto.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import proyecto.proyecto.dto.UsuarioDTO;
import proyecto.proyecto.entity.Usuario;
import proyecto.proyecto.entity.Perfil;
import proyecto.proyecto.repository.UsuarioRepository;
import proyecto.proyecto.repository.PerfilRepository;
import java.util.Optional;

@Service
public class UsuarioService {
    @Autowired
    UsuarioRepository usuarioRepository;

    @Autowired
    PerfilRepository perfilRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    public Page<Usuario> getAll(Pageable pageable) {
        return usuarioRepository.findAll(pageable);
    }

    public Optional<Usuario> getById(Long id) {
        return usuarioRepository.findById(id);
    }

    public Usuario save(UsuarioDTO dto) {
        Perfil perfil = perfilRepository.findById(dto.getIdPerfil())
                .orElseThrow(() -> new RuntimeException("Error: Perfil not found"));

        Usuario usuario = Usuario.builder()
                .strNombreUsuario(dto.getStrNombreUsuario())
                .perfil(perfil)
                .strPwd(passwordEncoder.encode(dto.getPassword()))
                .idEstadoUsuario(dto.getIdEstadoUsuario())
                .strCorreo(dto.getStrCorreo())
                .strNumeroCelular(dto.getStrNumeroCelular())
                .imagen(dto.getImagen())
                .build();

        return usuarioRepository.save(usuario);
    }

    public Usuario update(Long id, UsuarioDTO dto) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: User not found"));

        Perfil perfil = perfilRepository.findById(dto.getIdPerfil())
                .orElseThrow(() -> new RuntimeException("Error: Perfil not found"));

        usuario.setStrNombreUsuario(dto.getStrNombreUsuario());
        usuario.setPerfil(perfil);
        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            usuario.setStrPwd(passwordEncoder.encode(dto.getPassword()));
        }
        usuario.setIdEstadoUsuario(dto.getIdEstadoUsuario());
        usuario.setStrCorreo(dto.getStrCorreo());
        usuario.setStrNumeroCelular(dto.getStrNumeroCelular());
        usuario.setImagen(dto.getImagen());

        return usuarioRepository.save(usuario);
    }

    public void delete(Long id) {
        usuarioRepository.deleteById(id);
    }
}
