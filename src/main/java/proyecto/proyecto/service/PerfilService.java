package proyecto.proyecto.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import proyecto.proyecto.entity.Perfil;
import proyecto.proyecto.repository.PerfilRepository;
import java.util.Optional;

@Service
public class PerfilService {
    @Autowired
    PerfilRepository perfilRepository;

    public Page<Perfil> getAll(Pageable pageable) {
        return perfilRepository.findAll(pageable);
    }

    public Optional<Perfil> getById(Long id) {
        return perfilRepository.findById(id);
    }

    public Perfil save(Perfil perfil) {
        return perfilRepository.save(perfil);
    }

    public void delete(Long id) {
        perfilRepository.deleteById(id);
    }
}
