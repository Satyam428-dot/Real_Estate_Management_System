package com.estate.entities;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class Notification extends BaseClass {
	 @Column(nullable = false, length = 150)
	    private String title;
	    @Column(nullable = false, length = 500)
	    private String message;
	    @Column(name = "is_read", nullable = false)
	    private boolean isRead = false;
	    @Column(length = 50)
	    private String category; // e.g. "Bookings & Visits", "Enquiries", "Offers & Updates", "Account & Security"
	    @ManyToOne(fetch = FetchType.LAZY)
	    @JoinColumn(name = "user_id", nullable = false)
	    private User user;


}
