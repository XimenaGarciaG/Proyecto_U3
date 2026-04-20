package proyecto.proyecto.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import proyecto.proyecto.entity.Modulo;
import java.util.Optional;

@Repository
public interface ModuloRepository extends JpaRepository<Modulo, Long> {
    Optional<Modulo> findByStrNombreModuloIgnoreCase(String name);
}
