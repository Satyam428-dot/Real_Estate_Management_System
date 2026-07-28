package com.estate.dtos;


import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor


public class NotificationResponseDTO {

	private Long id;
    private String title;
    private String message;
    private boolean isRead;
    private String category;
    private LocalDate createdOn;
}
