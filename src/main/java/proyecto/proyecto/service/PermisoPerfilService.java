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
import java.util.List;
import java.util.Optional;

@Service
public class PermisoPerfilService {
    @Autowired
    PermisoPerfilRepository permisoPerfilRepository;

    @Autowired
    PerfilRepository perfilRepository;

    @Autowired
    ModuloRepository moduloRepository;

    public Page<PermisoPerfil> getAll(Pageable pageable) {
        return permisoPerfilRepository.findAll(pageable);
    }

    public Optional<PermisoPerfil> getById(Long id) {
        return permisoPerfilRepository.findById(id);
    }

    public PermisoPerfil save(PermisoPerfilDTO dto) {
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
