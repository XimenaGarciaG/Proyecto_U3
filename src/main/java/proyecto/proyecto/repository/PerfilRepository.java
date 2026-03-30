package proyecto.proyecto.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import proyecto.proyecto.entity.Perfil;

import java.util.Optional;

@Repository
public interface PerfilRepository extends JpaRepository<Perfil, Long> {
    Optional<Perfil> findByStrNombrePerfil(String name);
}
