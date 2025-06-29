package by.bsuir.emptyprojectforwork;

import io.jsonwebtoken.Claims;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final JwtUtil jwtUtil;

    public AdminController(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @GetMapping
    public ResponseEntity<?> adminPanel(@CookieValue(name = "jwt", required = false) String token) {
        if (token == null || !jwtUtil.isTokenValid(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Неавторизован");
        }

        Claims claims = jwtUtil.extractClaims(token);
        String username = claims.getSubject();
        List<String> roles = claims.get("roles", List.class);

        if (!roles.contains("ROLE_ADMIN")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Доступ запрещён");
        }

        return ResponseEntity.ok("Добро пожаловать в панель администратора, " + username);
    }
}
