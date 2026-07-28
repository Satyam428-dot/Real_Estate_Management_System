package com.estate.dtos;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SavedPropertyResponseDTO {

	private Long savedId;

	private LocalDate savedOn;

	private PropertyResponseDTO property;
}
