package com.estate.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.estate.entities.Lease;

public interface LeaseRepository extends JpaRepository<Lease, Long> {

	List<Lease> findByOwnerId(Long ownerId);
    List<Lease> findByTenantId(Long tenantId);
    List<Lease> findByPropertyId(Long propertyId);
	
	
}
