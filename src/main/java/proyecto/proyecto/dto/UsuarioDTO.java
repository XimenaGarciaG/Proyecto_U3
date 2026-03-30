package proyecto.proyecto.dto;

import lombok.Data;

@Data
public class UsuarioDTO {
    private Long id;
    private String strNombreUsuario;
    private Long idPerfil;
    private String nombrePerfil;
    private String strCorreo;
    private String strNumeroCelular;
    private int idEstadoUsuario;
    private String imagen;
    private String password; // Solo para creación/edición
}
