package by.bsuir.emptyprojectforwork;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
public class AdminController {
    @GetMapping
    public ResponseEntity<String> adminPanel() {
        return ResponseEntity.ok("Добро пожаловать в панель администратора");
    }
}

