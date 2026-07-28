package com.estate.dtos;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class NotificationRequestDTO {
	@NotNull(message = "User ID is required")
    private Long userId;
    @NotBlank(message = "Title cannot be blank")
    private String title;
    @NotBlank(message = "Message cannot be blank")
    private String message;
    @NotBlank(message = "Category cannot be blank")
    private String category;


}
