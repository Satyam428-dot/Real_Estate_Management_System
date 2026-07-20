package com.estate.dtos;

import java.time.LocalDateTime;

import com.estate.entities.VerificationStatus;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class PendingOwnerVerificationDto {
	private Long id;
	private LocalDateTime verificationDatetime;
	private String governmentIdProof;
	private String selfieImage;
	private VerificationStatus verificationStatus;
	private OwnerProfileDto owner;

	@Getter
	@Setter
	@ToString
	public static class OwnerProfileDto {
		private String firstName;
		private String lastName;
		private String email;
	}
}
