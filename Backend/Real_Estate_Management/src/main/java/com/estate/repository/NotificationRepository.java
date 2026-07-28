package com.estate.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.estate.entities.Notification;

@Repository

public interface NotificationRepository extends JpaRepository<Notification, Long> {

	List<Notification> findByUserEmailOrderByCreatedOnDesc(String userEmail);
    Optional<Notification> findByIdAndUserEmail(Long id, String userEmail);
    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.user.email = :userEmail AND n.isRead = false")
    int markAllAsReadForUser(@Param("userEmail") String userEmail);

    
}
