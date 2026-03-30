package proyecto.proyecto.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;

@Data
@AllArgsConstructor
public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String username;
    private String email;
    private Long perfilId;
    private List<PermisoPerfilDTO> permisos;

    public JwtResponse(String token, Long id, String username, String email, Long perfilId, List<PermisoPerfilDTO> permisos) {
        this.token = token;
        this.id = id;
        this.username = username;
        this.email = email;
        this.perfilId = perfilId;
        this.permisos = permisos;
    }
}
