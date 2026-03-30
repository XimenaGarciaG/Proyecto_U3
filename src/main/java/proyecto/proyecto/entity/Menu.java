package proyecto.proyecto.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "menus")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Menu {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long idMenuPadre; // 0 para raíz

    private String strNombreMenu;

    @ManyToOne
    @JoinColumn(name = "id_modulo", nullable = true)
    private Modulo modulo;
}
