package proyecto.proyecto.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import proyecto.proyecto.config.JwtUtils;
import proyecto.proyecto.config.UserDetailsImpl;
import proyecto.proyecto.dto.JwtResponse;
import proyecto.proyecto.dto.LoginRequest;
import proyecto.proyecto.dto.PermisoPerfilDTO;
import proyecto.proyecto.repository.PermisoPerfilRepository;
import proyecto.proyecto.util.CaptchaValidator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuthService {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    CaptchaValidator captchaValidator;

    @Autowired
    PermisoPerfilRepository permisoPerfilRepository;

    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        if (!captchaValidator.isValid(loginRequest.getCaptchaResponse())) {
            throw new RuntimeException("Error: Invalid Captcha");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(loginRequest.getUsername());

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        List<PermisoPerfilDTO> permisos = permisoPerfilRepository.findByPerfilId(userDetails.getPerfilId())
                .stream().map(p -> {
                    PermisoPerfilDTO dto = new PermisoPerfilDTO();
                    dto.setId(p.getId());
                    dto.setIdModulo(p.getModulo().getId());
                    dto.setNombreModulo(p.getModulo().getStrNombreModulo());
                    dto.setIdPerfil(p.getPerfil().getId());
                    dto.setBitAgregar(p.isBitAgregar());
                    dto.setBitEditar(p.isBitEditar());
                    dto.setBitConsulta(p.isBitConsulta());
                    dto.setBitEliminar(p.isBitEliminar());
                    dto.setBitDetalle(p.isBitDetalle());
                    return dto;
                }).collect(Collectors.toList());

        return new JwtResponse(jwt, userDetails.getId(), userDetails.getUsername(), userDetails.getEmail(), userDetails.getPerfilId(), userDetails.getImagen(), userDetails.isBitAdministrador(), permisos);
    }
}
