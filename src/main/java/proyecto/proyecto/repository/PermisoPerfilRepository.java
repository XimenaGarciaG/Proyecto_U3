package proyecto.proyecto.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import proyecto.proyecto.entity.PermisoPerfil;
import proyecto.proyecto.entity.Perfil;
import proyecto.proyecto.entity.Modulo;
import java.util.List;
import java.util.Optional;

@Repository
public interface PermisoPerfilRepository extends JpaRepository<PermisoPerfil, Long> {
    List<PermisoPerfil> findByPerfilId(Long perfilId);
    Optional<PermisoPerfil> findByPerfilAndModulo(Perfil perfil, Modulo modulo);
}
