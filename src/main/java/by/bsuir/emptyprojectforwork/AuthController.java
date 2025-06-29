package by.bsuir.emptyprojectforwork;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Value("${external.auth.url}")
    private String externalAuthUrl;

    private final JwtUtil jwtUtil;
    private final RestTemplate restTemplate = new RestTemplate();

    public AuthController(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials, HttpServletResponse response) {
        try {
            ResponseEntity<Map> externalResponse = restTemplate.postForEntity(
                externalAuthUrl,
                credentials,
                Map.class
            );

            if (externalResponse.getStatusCode() != HttpStatus.OK || externalResponse.getBody() == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Ошибка аутентификации в AD");
            }

            Map body = externalResponse.getBody();
            String name = (String) body.get("name");
            String tbn = (String) body.get("tbn");
            List<String> roles = (List<String>) body.get("role");

            if (roles == null || roles.isEmpty()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Нет доступных ролей");
            }

            String token = jwtUtil.generateToken(name, roles);
            ResponseCookie cookie = ResponseCookie.from("jwt", token)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(Duration.ofMillis(3600000))
                .build();

            response.setHeader(HttpHeaders.SET_COOKIE, cookie.toString());

            if (roles.contains("ROLE_ADMIN")) {
                return ResponseEntity.ok(Map.of("redirect", "/admin"));
            } else if (roles.contains("ROLE_BEZOP")) {
                return ResponseEntity.ok(Map.of("redirect", "/bezop"));
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Нет подходящих ролей");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Ошибка аутентификации в AD");
        }
    }
}
