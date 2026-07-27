package com.estate.service;



import java.util.List;

import com.estate.dtos.RentPaymentRequestDTO;
import com.estate.dtos.RentPaymentResponseDTO;

public interface RentPaymentService {

	RentPaymentResponseDTO createPayment(RentPaymentRequestDTO dto);

	List<RentPaymentResponseDTO> getPaymentsByOwner(Long ownerId);

	List<RentPaymentResponseDTO> getPaymentsByTenant(Long tenantId);

	RentPaymentResponseDTO getPaymentById(Long id);

	RentPaymentResponseDTO updatePaymentStatus(Long paymentId, String status, String transactionId);

}
