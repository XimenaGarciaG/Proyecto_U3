package proyecto.proyecto.config;

import java.util.Collection;
import java.util.Objects;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import proyecto.proyecto.entity.Usuario;
import proyecto.proyecto.dto.PermisoPerfilDTO;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.List;

public class UserDetailsImpl implements UserDetails {
    private static final long serialVersionUID = 1L;

    private Long id;
    private String username;
    private String email;
    private Long perfilId;
    private String perfilNombre;
    private String imagen;
    private boolean bitAdministrador;
    private List<PermisoPerfilDTO> permisos;

    @JsonIgnore
    private String password;

    private Collection<? extends GrantedAuthority> authorities;

    public UserDetailsImpl(Long id, String username, String email, String password, Long perfilId, String perfilNombre, String imagen, boolean bitAdministrador, List<PermisoPerfilDTO> permisos,
            Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.perfilId = perfilId;
        this.perfilNombre = perfilNombre;
        this.imagen = imagen;
        this.bitAdministrador = bitAdministrador;
        this.permisos = permisos;
        this.authorities = authorities;
    }

    public static UserDetailsImpl build(Usuario usuario, List<PermisoPerfilDTO> permisos, Collection<? extends GrantedAuthority> authorities) {
        return new UserDetailsImpl(
                usuario.getId(),
                usuario.getStrNombreUsuario(),
                usuario.getStrCorreo(),
                usuario.getStrPwd(),
                usuario.getPerfil().getId(),
                usuario.getPerfil().getStrNombrePerfil(),
                usuario.getImagen(),
                usuario.getPerfil().isBitAdministrador(),
                permisos,
                authorities);
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    public Long getId() { return id; }
    public String getEmail() { return email; }
    public Long getPerfilId() { return perfilId; }
    public String getPerfilNombre() { return perfilNombre; }
    public String getImagen() { return imagen; }
    public boolean isBitAdministrador() { return bitAdministrador; }
    public List<PermisoPerfilDTO> getPermisos() { return permisos; }

    @Override
    public String getPassword() { return password; }
    @Override
    public String getUsername() { return username; }
    @Override
    public boolean isAccountNonExpired() { return true; }
    @Override
    public boolean isAccountNonLocked() { return true; }
    @Override
    public boolean isCredentialsNonExpired() { return true; }
    @Override
    public boolean isEnabled() { return true; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserDetailsImpl user = (UserDetailsImpl) o;
        return Objects.equals(id, user.id);
    }
}
