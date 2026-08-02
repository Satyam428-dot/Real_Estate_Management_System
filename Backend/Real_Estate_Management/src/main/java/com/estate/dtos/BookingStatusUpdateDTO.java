package com.estate.dtos;

import com.estate.entities.enums.BookingStatus;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookingStatusUpdateDTO {

	@NotNull(message = "Status is required")
	private BookingStatus status;
}
