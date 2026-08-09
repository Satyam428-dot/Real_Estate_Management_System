package com.estate.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.Customizer;
import org.springframework.http.HttpMethod;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.List;

import lombok.RequiredArgsConstructor;

@Configuration
//@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

	private final CustomUserDetailsService customUserDetailsService;
	private final JwtAuthenticationFilter jwtAuthenticationFilter;

	@Bean
	PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	AuthenticationProvider authenticationProvider() {
		DaoAuthenticationProvider provider = new DaoAuthenticationProvider(customUserDetailsService);
		provider.setPasswordEncoder(passwordEncoder());
		return provider;
	}

	@Bean
	AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
		return configuration.getAuthenticationManager();
	}

	@Bean
	CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();
		configuration.setAllowedOriginPatterns(List.of(
			"http://localhost:5173",
			"http://localhost:3000",
			"http://127.0.0.1:5173",
			"https://realestatemanagementsystem-dusky.vercel.app",
			"https://*.vercel.app",
			"*"
		));
		configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
		configuration.setAllowedHeaders(List.of("*"));
		configuration.setExposedHeaders(List.of("Authorization", "Content-Type"));
		configuration.setAllowCredentials(true);

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		return source;
	}

	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

		http.csrf(csrf -> csrf.disable())
				.cors(Customizer.withDefaults())

				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

				.authenticationProvider(authenticationProvider())

				.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)

				.exceptionHandling(exception -> exception.authenticationEntryPoint((request, response,
						authException) -> response.sendError(HttpStatus.UNAUTHORIZED.value(), "Unauthorized")))

				.authorizeHttpRequests(auth -> auth
						.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
						.requestMatchers("/register", "/login", "/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html")
						.permitAll()
						.requestMatchers(HttpMethod.GET, "/blogs/**").permitAll()
						.requestMatchers(HttpMethod.POST, "/blogs/seed").permitAll()
						.requestMatchers(HttpMethod.POST, "/blogs/**").authenticated()
						.requestMatchers(HttpMethod.PUT, "/blogs/**").authenticated()
						.requestMatchers(HttpMethod.PATCH, "/blogs/**").authenticated()
						.requestMatchers(HttpMethod.DELETE, "/blogs/**").authenticated()
						.anyRequest().permitAll());

		return http.build();
	}
}

