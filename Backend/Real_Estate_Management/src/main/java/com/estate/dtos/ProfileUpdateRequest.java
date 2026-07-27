package com.estate.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ProfileUpdateRequest {
    @NotBlank private String firstName;
    @NotBlank private String lastName;
    private String phone;
}
