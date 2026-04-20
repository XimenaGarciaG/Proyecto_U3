package proyecto.proyecto.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import proyecto.proyecto.entity.PermisoPerfil;
import proyecto.proyecto.repository.PermisoPerfilRepository;
import proyecto.proyecto.repository.PerfilRepository;
import proyecto.proyecto.repository.ModuloRepository;
import proyecto.proyecto.dto.PermisoPerfilDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import jakarta.annotation.PostConstruct;
import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.Comparator;

@Service
public class PermisoPerfilService {
    @Autowired
    PermisoPerfilRepository permisoPerfilRepository;

    @Autowired
    PerfilRepository perfilRepository;

    @Autowired
    ModuloRepository moduloRepository;

    @PostConstruct
    public void limpiarDuplicados() {
        // Tarea quirúrgica: Borrar duplicados perfil+modulo dejando solo el más nuevo
        List<PermisoPerfil> all = permisoPerfilRepository.findAll();
        Map<String, List<PermisoPerfil>> map = new HashMap<>();

        for (PermisoPerfil p : all) {
            String key = p.getPerfil().getId() + "-" + p.getModulo().getId();
            map.computeIfAbsent(key, k -> new ArrayList<>()).add(p);
        }

        for (List<PermisoPerfil> list : map.values()) {
            if (list.size() > 1) {
                // Ordenar por ID descendente (el más nuevo primero)
                list.sort(Comparator.comparing(PermisoPerfil::getId).reversed());
                // Borrar todos excepto el primero
                for (int i = 1; i < list.size(); i++) {
                    permisoPerfilRepository.delete(list.get(i));
                }
            }
        }
    }

    public Page<PermisoPerfil> getAll(Pageable pageable) {
        return permisoPerfilRepository.findAll(pageable);
    }

    public Optional<PermisoPerfil> getById(Long id) {
        return permisoPerfilRepository.findById(id);
    }

    public PermisoPerfil save(PermisoPerfilDTO dto) {
        // UPSERT LOGIC OPTIMIZADA: Uso directo de repositorio
        Optional<PermisoPerfil> existing = permisoPerfilRepository.findByPerfilAndModulo(
                perfilRepository.findById(dto.getIdPerfil()).orElse(null),
                moduloRepository.findById(dto.getIdModulo()).orElse(null)
        );

        if (existing.isPresent()) {
            return update(existing.get().getId(), dto);
        }

        PermisoPerfil permiso = new PermisoPerfil();
        permiso.setPerfil(perfilRepository.findById(dto.getIdPerfil()).orElseThrow());
        permiso.setModulo(moduloRepository.findById(dto.getIdModulo()).orElseThrow());
        permiso.setBitAgregar(dto.isBitAgregar());
        permiso.setBitEditar(dto.isBitEditar());
        permiso.setBitConsulta(dto.isBitConsulta());
        permiso.setBitEliminar(dto.isBitEliminar());
        permiso.setBitDetalle(dto.isBitDetalle());
        return permisoPerfilRepository.save(permiso);
    }

    public PermisoPerfil update(Long id, PermisoPerfilDTO dto) {
        PermisoPerfil permiso = permisoPerfilRepository.findById(id).orElseThrow();
        if (dto.getIdPerfil() != null) {
            permiso.setPerfil(perfilRepository.findById(dto.getIdPerfil()).orElseThrow());
        }
        if (dto.getIdModulo() != null) {
            permiso.setModulo(moduloRepository.findById(dto.getIdModulo()).orElseThrow());
        }
        permiso.setBitAgregar(dto.isBitAgregar());
        permiso.setBitEditar(dto.isBitEditar());
        permiso.setBitConsulta(dto.isBitConsulta());
        permiso.setBitEliminar(dto.isBitEliminar());
        permiso.setBitDetalle(dto.isBitDetalle());
        return permisoPerfilRepository.save(permiso);
    }

    public void delete(Long id) {
        permisoPerfilRepository.deleteById(id);
    }
}
