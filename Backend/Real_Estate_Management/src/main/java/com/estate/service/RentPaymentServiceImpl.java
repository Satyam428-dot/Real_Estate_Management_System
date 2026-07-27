package com.estate.service;

import java.time.LocalDate;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.estate.dtos.RentPaymentRequestDTO;
import com.estate.dtos.RentPaymentResponseDTO;
import com.estate.entities.Property;
import com.estate.entities.RentPayment;
import com.estate.entities.User;
import com.estate.entities.enums.PaymentStatus;
import com.estate.entities.enums.PaymentType;
import com.estate.repository.PropertyRepository;
import com.estate.repository.RentPaymentRepository;
import com.estate.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class RentPaymentServiceImpl implements RentPaymentService {

	private final RentPaymentRepository paymentRepo;
	private final UserRepository userRepo;
	private final PropertyRepository propertyRepo;
	private final ModelMapper mapper;
	
	private RentPaymentResponseDTO convertToDTO(RentPayment payment) {
		RentPaymentResponseDTO dto = mapper.map(payment, RentPaymentResponseDTO.class);
		dto.setPaymentId(payment.getId());
		
		if (payment.getProperty() != null) {
			dto.setPropertyId(payment.getProperty().getId());
			dto.setPropertyTitle(payment.getProperty().getTitle());
		}
		
		if (payment.getTenant() != null) {
			dto.setTenantId(payment.getTenant().getId()); // 👈 Fixed
			dto.setTenantName(payment.getTenant().getFirstName() + " " + payment.getTenant().getLastName());
		}
		
		if (payment.getOwner() != null) {
			dto.setOwnerId(payment.getOwner().getId());
		}

		return dto;
	}
	
	@Override
	public RentPaymentResponseDTO createPayment(RentPaymentRequestDTO dto) {
		Property property = propertyRepo.findById(dto.getPropertyId())
				.orElseThrow(() -> new RuntimeException("Property Not found"));
		
		User tenant = userRepo.findById(dto.getTenantId())
				.orElseThrow(() -> new RuntimeException("Tenant Not found"));
		
		User owner = userRepo.findById(dto.getOwnerId())
				.orElseThrow(() -> new RuntimeException("Owner Not found"));
		
		RentPayment payment = RentPayment.builder()
				.property(property)
				.tenant(tenant)
				.owner(owner)
				.amount(dto.getAmount())
				.dueDate(dto.getDueDate() != null ? dto.getDueDate() : LocalDate.now())
				.paymentDate(dto.getPaymentDate())
				.paymentType(dto.getPaymentType() != null ? dto.getPaymentType() : PaymentType.RENT)
				.paymentStatus(dto.getPaymentStatus() != null ? dto.getPaymentStatus() : PaymentStatus.PENDING)
				.transactionId(dto.getTransactionId())
				.build();
		
		RentPayment saved = paymentRepo.save(payment);
		return convertToDTO(saved);
	}

	@Override
	public List<RentPaymentResponseDTO> getPaymentsByOwner(Long ownerId) {
		List<RentPayment> payments = paymentRepo.findByOwnerId(ownerId);
		return payments.stream().map(this::convertToDTO).toList();
	}

	@Override
	public List<RentPaymentResponseDTO> getPaymentsByTenant(Long tenantId) {
		List<RentPayment> payments = paymentRepo.findByTenantId(tenantId);
		return payments.stream().map(this::convertToDTO).toList();
	}

	@Override
	public RentPaymentResponseDTO getPaymentById(Long paymentId) {
		RentPayment payment = paymentRepo.findById(paymentId)
				.orElseThrow(() -> new RuntimeException("Payment record not found"));
		return convertToDTO(payment);
	}

	@Override
	public RentPaymentResponseDTO updatePaymentStatus(Long paymentId, String status, String transactionId) {
		RentPayment payment = paymentRepo.findById(paymentId)
				.orElseThrow(() -> new RuntimeException("Payment record not found"));
		payment.setPaymentStatus(PaymentStatus.valueOf(status.toUpperCase()));
		if (transactionId != null) {
			payment.setTransactionId(transactionId);
		}
		if (payment.getPaymentStatus() == PaymentStatus.PAID && payment.getPaymentDate() == null) {
			payment.setPaymentDate(LocalDate.now());
		}
		RentPayment saved = paymentRepo.save(payment);
		return convertToDTO(saved);
	}
}