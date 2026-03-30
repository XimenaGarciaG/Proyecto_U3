package proyecto.proyecto.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import proyecto.proyecto.entity.Modulo;

@Repository
public interface ModuloRepository extends JpaRepository<Modulo, Long> {
}
