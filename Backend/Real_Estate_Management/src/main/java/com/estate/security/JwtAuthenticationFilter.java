package com.estate.security;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.micrometer.common.lang.NonNull;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private final JwtUtil jwtUtil;
	private final CustomUserDetailsService customUserDetailsService;

	@Override
	protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response,
			@NonNull FilterChain filterChain) throws ServletException, IOException {

		// Step 0: Bypass JWT check for OPTIONS preflight requests
		if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
			filterChain.doFilter(request, response);
			return;
		}

		// Step 1: Get Authorization header
		final String authHeader = request.getHeader("Authorization");

		// Step 2: Check if header exists and starts with "Bearer "
		if (authHeader == null || !authHeader.startsWith("Bearer ")) {
			filterChain.doFilter(request, response);
			return;
		}

		// Step 3: Extract JWT
		String jwt = authHeader.substring(7);

		// Step 4: Extract username/email from token
		String email = jwtUtil.extractEmail(jwt);

		// Step 5: Authenticate only if user is not already authenticated
		if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {

			// Step 6: Load user from database
			UserDetails userDetails = customUserDetailsService.loadUserByUsername(email);

			// Step 7: Validate token
			if (jwtUtil.validateToken(jwt, userDetails)) {

				// Step 8: Create Authentication object
				UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userDetails,
						null, userDetails.getAuthorities());

				// Step 9: Attach request details
				authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

				// Step 10: Store authentication in SecurityContext
				SecurityContextHolder.getContext().setAuthentication(authToken);
			}
		}

		// Step 11: Continue the filter chain
		filterChain.doFilter(request, response);
	}
}
