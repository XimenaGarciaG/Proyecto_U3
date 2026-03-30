package proyecto.proyecto.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "usuarios")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String strNombreUsuario;

    @ManyToOne
    @JoinColumn(name = "id_perfil", nullable = false)
    private Perfil perfil;

    @Column(nullable = false)
    private String strPwd;

    private int idEstadoUsuario; // 1=activo, 0=inactivo

    @Column(length = 100)
    private String strCorreo;

    @Column(length = 20)
    private String strNumeroCelular;

    @Lob
    private String imagen; // Base64 or path
}
