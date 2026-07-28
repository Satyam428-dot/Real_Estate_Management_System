package com.estate.service;

import java.util.List;
import com.estate.dtos.NotificationRequestDTO;
import com.estate.dtos.NotificationResponseDTO;

public interface NotificationService {
	NotificationResponseDTO createNotification(NotificationRequestDTO dto);
    List<NotificationResponseDTO> getUserNotifications(String userEmail);
    NotificationResponseDTO markAsRead(Long id, String userEmail);
    void markAllAsRead(String userEmail);
    void deleteNotification(Long id, String userEmail);

}
