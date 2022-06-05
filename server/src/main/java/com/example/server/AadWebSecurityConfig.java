package com.example.server;


import com.azure.spring.cloud.autoconfigure.aad.filter.AadAppRoleStatelessAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class AadWebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private AadAppRoleStatelessAuthenticationFilter aadAuthFilter;

    @Override
    protected void configure(HttpSecurity http) throws Exception {

        http.cors().and().authorizeRequests()
                .antMatchers("/admin/**").hasRole("TaskAdmin")
                .antMatchers("/", "/index.html", "/public").permitAll()
                .anyRequest().authenticated();

        http.addFilterBefore(aadAuthFilter, UsernamePasswordAuthenticationFilter.class);

    }
}