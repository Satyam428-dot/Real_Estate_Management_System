package com.estate.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.estate.entities.OwnerVerification;
import com.estate.entities.VerificationStatus;

public interface OwnerVerificationRepository extends JpaRepository<OwnerVerification, Long> {
	// Using JOIN FETCH ensures the linked User info is loaded in 1 database call

	@Query("SELECT ov FROM OwnerVerification ov JOIN FETCH ov.owner WHERE ov.verificationStatus = :status")
	List<OwnerVerification> findByVerificationStatusWithUser(@Param("status") VerificationStatus status);

	@Query("SELECT ov FROM OwnerVerification ov WHERE ov.owner.id = :ownerId")
	OwnerVerification findByOwnerId(@Param("ownerId") Long ownerId);

}
