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
    @ResponseBody
    public String publicMethod() {
        return "public endpoint response";
    }

    @GetMapping("/authorized")
    @ResponseBody
    @PreAuthorize("hasRole('ROLE_TaskUser')")
    public String onlyAuthorizedUsers() {
        return "authorized endpoint response";
    }

    @GetMapping("/admin/demo")
    @ResponseBody
    // For demo purposes for this endpoint we configure the required role in the AadWebSecurityConfig class.
    // However, it is advisable to use method level security with @PreAuthorize("hasRole('xxx')")
    public String onlyForAdmins() {
        return "admin endpoint";
    }
}
