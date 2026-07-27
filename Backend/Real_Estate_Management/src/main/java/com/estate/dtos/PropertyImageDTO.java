package com.estate.dtos;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PropertyImageDTO {

	private Long id;

	private String imageUrl;

	private Boolean isMain;
}
