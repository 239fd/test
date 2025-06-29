package by.bsuir.emptyprojectforwork;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// === BezopController.java ===
@RestController
@RequestMapping("/bezop")
public class BezopController {
    @GetMapping
    public ResponseEntity<String> bezopPage() {
        return ResponseEntity.ok("Добро пожаловать в раздел безопасности");
    }
}
