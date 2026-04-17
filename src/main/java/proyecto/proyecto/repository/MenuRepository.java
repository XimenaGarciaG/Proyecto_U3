package proyecto.proyecto.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import proyecto.proyecto.entity.Menu;
import java.util.List;

@Repository
public interface MenuRepository extends JpaRepository<Menu, Long> {
    List<Menu> findByIdMenuPadre(Long idMenuPadre);
    java.util.Optional<Menu> findByStrNombreMenu(String name);
}
