package com.estate.service;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.estate.customExceptions.ResourceNotFoundException;
import com.estate.dtos.NotificationRequestDTO;
import com.estate.dtos.NotificationResponseDTO;
import com.estate.entities.Notification;
import com.estate.entities.User;
import com.estate.repository.NotificationRepository;
import com.estate.repository.UserRepository;
import lombok.RequiredArgsConstructor;
@Service
@Transactional
@RequiredArgsConstructor

public class NotificationServiceImpl implements NotificationService {
	 private final NotificationRepository notificationRepository;
	    private final UserRepository userRepository;
	    @Override
	    public NotificationResponseDTO createNotification(NotificationRequestDTO dto) {
	        User user = userRepository.findById(dto.getUserId())
	                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + dto.getUserId()));
	        Notification notification = new Notification();
	        notification.setTitle(dto.getTitle());
	        notification.setMessage(dto.getMessage());
	        notification.setCategory(dto.getCategory());
	        notification.setUser(user);
	        notification.setRead(false);
	        Notification saved = notificationRepository.save(notification);
	        return mapToDTO(saved);
	    }
	    @Override
	    @Transactional(readOnly = true)
	    public List<NotificationResponseDTO> getUserNotifications(String userEmail) {
	        return notificationRepository.findByUserEmailOrderByCreatedOnDesc(userEmail)
	                .stream()
	                .map(this::mapToDTO)
	                .toList();
	    }
	    @Override
	    public NotificationResponseDTO markAsRead(Long id, String userEmail) {
	        Notification notification = notificationRepository.findByIdAndUserEmail(id, userEmail)
	                .orElseThrow(() -> new ResourceNotFoundException("Notification not found for id: " + id));
	        notification.setRead(true);
	        Notification updated = notificationRepository.save(notification);
	        return mapToDTO(updated);
	    }
	    @Override
	    public void markAllAsRead(String userEmail) {
	        notificationRepository.markAllAsReadForUser(userEmail);
	    }
	    @Override
	    public void deleteNotification(Long id, String userEmail) {
	        Notification notification = notificationRepository.findByIdAndUserEmail(id, userEmail)
	                .orElseThrow(() -> new ResourceNotFoundException("Notification not found for id: " + id));
	        notificationRepository.delete(notification);
	    }
	    private NotificationResponseDTO mapToDTO(Notification n) {
	        return new NotificationResponseDTO(
	                n.getId(),
	                n.getTitle(),
	                n.getMessage(),
	                n.isRead(),
	                n.getCategory(),
	                n.getCreatedOn()
	        );
	    }


}
