package com.estate.dtos;

import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserProfileResponse {
    private long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private LocalDate createdOn;
}
