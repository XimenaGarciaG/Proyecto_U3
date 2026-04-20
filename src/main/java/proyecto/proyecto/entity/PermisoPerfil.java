package proyecto.proyecto.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "permisos_perfil", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"id_perfil", "id_modulo"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PermisoPerfil {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_modulo", nullable = false)
    private Modulo modulo;

    @ManyToOne
    @JoinColumn(name = "id_perfil", nullable = false)
    private Perfil perfil;

    private boolean bitAgregar;
    private boolean bitEditar;
    private boolean bitConsulta;
    private boolean bitEliminar;
    private boolean bitDetalle;
}
