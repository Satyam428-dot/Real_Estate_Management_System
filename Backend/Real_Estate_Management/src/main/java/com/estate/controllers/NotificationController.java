package com.estate.controllers;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.estate.dtos.NotificationRequestDTO;
import com.estate.dtos.NotificationResponseDTO;
import com.estate.service.NotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
@RestController
@RequestMapping("/notifications")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor


public class NotificationController {
	 private final NotificationService notificationService;
	    // 1. Send/create a new notification
	    @PostMapping
	    public ResponseEntity<NotificationResponseDTO> createNotification(@Valid @RequestBody NotificationRequestDTO dto) {
	        return new ResponseEntity<>(notificationService.createNotification(dto), HttpStatus.CREATED);
	    }
	    // 2. Get list of notifications for current logged-in user
	    @GetMapping
	    public ResponseEntity<List<NotificationResponseDTO>> getUserNotifications(Authentication authentication) {
	        return ResponseEntity.ok(notificationService.getUserNotifications(authentication.getName()));
	    }
	    // 3. Mark a single notification as read
	    @PutMapping("/{id}/read")
	    public ResponseEntity<NotificationResponseDTO> markAsRead(@PathVariable Long id, Authentication authentication) {
	        return ResponseEntity.ok(notificationService.markAsRead(id, authentication.getName()));
	    }
	    // 4. Mark all notifications as read for current user
	    @PutMapping("/read-all")
	    public ResponseEntity<String> markAllAsRead(Authentication authentication) {
	        notificationService.markAllAsRead(authentication.getName());
	        return ResponseEntity.ok("All notifications marked as read.");
	    }
	    // 5. Clear / Delete a notification
	    @DeleteMapping("/{id}")
	    public ResponseEntity<String> deleteNotification(@PathVariable Long id, Authentication authentication) {
	        notificationService.deleteNotification(id, authentication.getName());
	        return ResponseEntity.ok("Notification deleted successfully.");
	    }


}
