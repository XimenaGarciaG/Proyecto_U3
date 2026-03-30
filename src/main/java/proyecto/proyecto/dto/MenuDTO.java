package proyecto.proyecto.dto;

import lombok.Data;
import java.util.List;
import java.util.ArrayList;

@Data
public class MenuDTO {
    private Long id;
    private Long idMenuPadre;
    private Long idModulo;
    private String nombreModulo;
    private String nombreMenu;
    private List<MenuDTO> subMenus = new ArrayList<>();
}
