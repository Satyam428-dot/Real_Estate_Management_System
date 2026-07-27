package com.estate.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.estate.entities.RentPayment;

public interface RentPaymentRepository extends JpaRepository<RentPayment, Long> {
    List<RentPayment> findByOwnerId(Long ownerId);
    List<RentPayment> findByTenantId(Long tenantId);
    List<RentPayment> findByPropertyId(Long propertyId);
}