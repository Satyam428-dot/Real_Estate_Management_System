package com.estate.dtos;

import com.estate.entities.enums.VisitStatus;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class VisitStatusUpdateDTO {

	@NotNull(message = "Status cannot be null")
	private VisitStatus status;
}