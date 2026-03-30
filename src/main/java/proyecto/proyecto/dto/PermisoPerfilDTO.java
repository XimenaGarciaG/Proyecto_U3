package proyecto.proyecto.dto;

import lombok.Data;

@Data
public class PermisoPerfilDTO {
    private Long id;
    private Long idModulo;
    private String nombreModulo;
    private Long idPerfil;
    private boolean bitAgregar;
    private boolean bitEditar;
    private boolean bitConsulta;
    private boolean bitEliminar;
    private boolean bitDetalle;
}
