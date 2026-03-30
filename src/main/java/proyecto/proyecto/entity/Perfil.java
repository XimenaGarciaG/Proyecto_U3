package proyecto.proyecto.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "perfiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Perfil {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String strNombrePerfil;

    private boolean bitAdministrador;
}
