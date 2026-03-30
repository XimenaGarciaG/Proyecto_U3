package proyecto.proyecto.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import proyecto.proyecto.entity.Modulo;
import proyecto.proyecto.repository.ModuloRepository;
import java.util.Optional;

@Service
public class ModuloService {
    @Autowired
    ModuloRepository moduloRepository;

    public Page<Modulo> getAll(Pageable pageable) {
        return moduloRepository.findAll(pageable);
    }

    public Optional<Modulo> getById(Long id) {
        return moduloRepository.findById(id);
    }

    public Modulo save(Modulo modulo) {
        return moduloRepository.save(modulo);
    }

    public void delete(Long id) {
        moduloRepository.deleteById(id);
    }
}
