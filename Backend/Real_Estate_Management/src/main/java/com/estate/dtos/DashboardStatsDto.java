package com.estate.dtos;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsDto {
	// Cards
	private long totalUsers;
	private long totalOwners;
	private long totalCustomers;
	private long totalProperties;
	private long pendingOwners;
	private long pendingProperties;

	// Charts
	private List<ChartDataDto> userDistribution;
	private List<ChartDataDto> propertyTypeDistribution;
	private List<ChartDataDto> propertyStatusDistribution;
	private List<ChartDataDto> monthlyUsers;
	private List<ChartDataDto> monthlyProperties;
}
