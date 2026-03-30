package proyecto.proyecto.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ViewController {

    @GetMapping("/")
    public String index() {
        return "index";
    }

    @GetMapping("/login.html")
    public String login() {
        return "login";
    }

    @GetMapping("/dashboard.html")
    public String dashboard() {
        return "dashboard";
    }

    @GetMapping("/error.html")
    public String error() {
        return "error";
    }
}
