package com.estate.service;

import java.util.List;

import com.estate.dtos.ScheduleVisitRequestDTO;
import com.estate.dtos.VisitResponseDTO;
import com.estate.entities.enums.VisitStatus;

public interface PropertyVisitService {

	VisitResponseDTO scheduleVisit(ScheduleVisitRequestDTO dto, String buyerEmail);

	List<VisitResponseDTO> getBuyerVisits(String buyerEmail);

	List<VisitResponseDTO> getOwnerVisits(String ownerEmail);

	VisitResponseDTO updateVisitStatus(Long visitId, VisitStatus status, String userEmail);

	void cancelVisit(Long visitId, String buyerEmail);
}