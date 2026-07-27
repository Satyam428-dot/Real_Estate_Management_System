package com.estate.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class PropertyImageDTO {

	private Long id;

	private String imageUrl;

	private Boolean isMain;
}
