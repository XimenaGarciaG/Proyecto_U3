package proyecto.proyecto;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import proyecto.proyecto.entity.Perfil;
import proyecto.proyecto.entity.Usuario;
import proyecto.proyecto.repository.PerfilRepository;
import proyecto.proyecto.repository.UsuarioRepository;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;

@SpringBootApplication
public class ProyectoApplication {

	public static void main(String[] args) {
		SpringApplication.run(ProyectoApplication.class, args);
	}

	@Bean
	CommandLineRunner init(UsuarioRepository usuarioRepository, PerfilRepository perfilRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			if (usuarioRepository.findByStrNombreUsuario("admin").isEmpty()) {
				Perfil adminPerfil = perfilRepository.findByStrNombrePerfil("Administrador")
						.orElseGet(() -> {
							Perfil p = new Perfil();
							p.setStrNombrePerfil("Administrador");
							p.setBitAdministrador(true);
							return perfilRepository.save(p);
						});

				Usuario admin = new Usuario();
				admin.setStrNombreUsuario("admin");
				admin.setStrPwd(passwordEncoder.encode("admin123"));
				admin.setPerfil(adminPerfil);
				admin.setIdEstadoUsuario(1);
				admin.setStrCorreo("admin@empresa.com");
				usuarioRepository.save(admin);
				System.out.println(">>> User 'admin' created with password 'admin123'");
			} else {
				// Update password just in case it was wrong
				Usuario admin = usuarioRepository.findByStrNombreUsuario("admin").get();
				admin.setStrPwd(passwordEncoder.encode("admin123"));
				usuarioRepository.save(admin);
				System.out.println(">>> User 'admin' password updated to 'admin123'");
			}
		};
	}

	@Bean
	public WebServerFactoryCustomizer<TomcatServletWebServerFactory> webServerFactoryCustomizer() {
		return factory -> {
			String port = System.getenv("PORT");
			if (port != null) {
				factory.setPort(Integer.parseInt(port));
			}
		};
	}
}
