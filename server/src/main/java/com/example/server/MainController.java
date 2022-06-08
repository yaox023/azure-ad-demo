package com.example.server;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
public class MainController {

    @GetMapping("/public")
    public String publicMethod() {
        return "public endpoint response";
    }

    @GetMapping("/private")
    public String privateMethod() {
        return "private endpoint response";
    }
}
